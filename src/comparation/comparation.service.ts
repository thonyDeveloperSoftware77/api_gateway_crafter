import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ComparationService {
  async ComparationCareer(career_id_1: number, career_id_2: number): Promise<any> {
    try {
      const response = await axios.post(
        'https://comparacion-crafters.onrender.com/',
        new URLSearchParams({
          career_id_1: career_id_1.toString(),
          career_id_2: career_id_2.toString(),
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error comparing careers: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async comparationSkills(user_id: string, career_id:number): Promise<any> {
    try {
      const response = await axios.post(
        'https://comparacion-crafters.onrender.com/compare-skills',
        new URLSearchParams({
          user_id: user_id.toString(),
          career_id: career_id.toString(),
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error comparing skills: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
