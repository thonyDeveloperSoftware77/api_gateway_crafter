/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  // The Firestore instance is stored in a private property
  #db: FirebaseFirestore.Firestore;
  /**
   * The constructor receives the firebaseApp as a dependency
   * @param firebaseApp
   */
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = firebaseApp.firestore();
  }


  /**
   * This method creates a new user with Method createUser from Firebase
   * @param user
   * @returns
   */
  async createUser(user: { email: string, password: string, displayName: string, role_firebase: string}) {
    try {
      const userRecord = await this.firebaseApp.auth().createUser(user);
      console.log('Successfully created new user:', userRecord.uid);
      await this.firebaseApp.auth().setCustomUserClaims(userRecord.uid, { role: user.role_firebase });

      return userRecord;
    } catch (error) {
      console.log('Error creating new user:', error);
      throw new Error('Error creating new user ' + error);
    }
  }

  /**
   * This method deletes a user with Method deleteUser from Firebase
   * @param uid
   */
  async deleteUser(uid: string) {
    try {
      await this.firebaseApp.auth().deleteUser(uid);
      console.log('Successfully deleted user:', uid);
    } catch (error) {
      console.log('Error deleting user:', error);
      throw error;
    }
  }


  /**
   * This method verifies a token with Method verifyIdToken from Firebase
   * @param token
   * @returns
   */
  async verifyToken(token: string) {
    try {
      const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);
      console.log(decodedToken.uid);
      return {
        uid: decodedToken.uid,
        role: decodedToken.role || null, // Aquí obtenemos el rol del token
      };
    } catch (error) {
      console.log('Error verifying token:', error);
      throw error;
    }
  }

}