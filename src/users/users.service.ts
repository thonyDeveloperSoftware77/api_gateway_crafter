import { Injectable } from '@nestjs/common';
import { SupabaseService } from "../supabase/supabase.service";
import { FirebaseRepository } from "../firebase/firebase.service";
import { UsersModel } from "./users.model";

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

  async createUser(uid: string, email: string, password:string,   firstName: string, lastName: string, role: string) {
    const userData: UsersModel = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: role,
      is_active: true,
      created_at: new Date(),
    };

    //Verificar que sea mas de 8 caracteres
    if(password.length < 8){
      throw new Error('Password must be at least 8 characters long');
    }
    // Create user in Firebase
    try {
      const userRecord = await this.firebaseRepository.createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`
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

      return userData;

    } catch (error) {
      throw error;
    }

  }
}
