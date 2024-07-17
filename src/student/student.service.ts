import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { UsersModel } from "../users/users.model";

@Injectable()
export class StudentService {
  async getUserById(uid: string): Promise<UsersModel> {
    console.log(uid)
    try {
      const response = await axios.get(`http://localhost:6052/users/${uid}`);
      return response.data as UsersModel;
    } catch (error) {
      throw new HttpException(
        `Error fetching user with id ${uid}: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getUserSkills(uid:string): Promise<any[]> {
    console.log(uid)
    try {
      const response = await axios.get(`http://localhost:6052/users-skills/${uid}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error fetching skills: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async postUserSkill(user_id: string, skill_id: number): Promise<any> {
    console.log(user_id, skill_id)

    const userSkil = {user_id, skill_id}
    console.log(userSkil)
    try {
      await axios.post('http://localhost:6052/users-skills', {
        userSkill: userSkil,
      });
      return userSkil;

    } catch (error) {
      throw new HttpException(
        `Error adding skill to user with id ${user_id}: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserSkill(user_id: string, skill_id: number): Promise<any> {
    console.log(user_id, skill_id)
    try {
      const response = await axios.delete(`http://localhost:6052/users-skills`, {
        data: {
          user_id,
          skill_id,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error deleting skill from user with id ${user_id}: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }

  async getUserCarrers(user_id: string): Promise<any[]> {
    console.log(user_id)
    try {
      const response = await axios.get(`http://localhost:6052/users-careers/${user_id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error fetching careers: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
