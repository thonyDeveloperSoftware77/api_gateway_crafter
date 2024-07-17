import { Injectable } from '@nestjs/common';
import { SupabaseService } from "../supabase/supabase.service";
import { FirebaseRepository } from "../firebase/firebase.service";
import { UsersModel } from "./users.model";
import * as https from "https";

@Injectable()
export class UsersService {
  private supabaseClient;

  constructor(
    private readonly  supabaseService: SupabaseService,
    private firebaseRepository: FirebaseRepository
  ) {
    this.supabaseClient = this.supabaseService.getClient();
  }

  async getUserByUid(uid: string) {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('uid', uid);

    if (error) {
      throw error;
    }

    return data[0];
  }

  async createUser(_email: string, _password:string,   firstName: string, lastName: string, role: string) {

    const userData: UsersModel = {
      email: _email,
      first_name: firstName,
      last_name: lastName,
      role: role,
      is_active: true,
      created_at: new Date(),
    };
    console.log(userData)

    //Vreify that all fields are present
    if(!userData.email || !userData.first_name || !userData.last_name || !userData.role){
      throw new Error('Missing fields');
    }

    //Verify that the role is user or admin
    if(userData.role !== 'user' && userData.role !== 'admin'){
      throw new Error('Invalid role');
    }

    userData.role = 'user'

    //Verify that the email is valid with a regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(_email)){
      throw new Error('Invalid email');
    }

    //Verify that the password is at least 8 characters long
    if(_password.length < 8){
      throw new Error('Password must be at least 8 characters long');
    }
    // Create user in Firebase
    try {
      const userRecord = await this.firebaseRepository.createUser({
        email: _email,
        password: _password,
        displayName: `${firstName} ${lastName}`,
        role_firebase: userData.role
      });

      userData.uid = userRecord.uid;

      const { data, error } = await this.supabaseClient
        .from('users')
        .insert([{
          uid: userData.uid,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          is_active: userData.is_active,
          created_at: userData.created_at }])
        .select();

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        throw new Error('User not created');
      }

      // Send notification via Lambda using https module
      const notificationPayload = JSON.stringify({
        correo: _email,
        mensaje: [
          {
            Email: _email,
            Password: _password,
          },
        ],
      });

      const notificationOptions = {
        hostname: 'a0bfxuhxeh.execute-api.us-east-2.amazonaws.com',
        port: 443,
        path: '/Test/envio_notificacion',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': notificationPayload.length,
        },
      };

      const notificationPromise = new Promise((resolve, reject) => {
        const req = https.request(notificationOptions, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            if (res.statusCode === 200) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`Notification failed with status code ${res.statusCode}`));
            }
          });
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.write(notificationPayload);
        req.end();
      });

      const notificationResponse = await notificationPromise;
      console.log('Notificación enviada:', notificationResponse);

      return userData;

    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User not created');
    }

  }
}
