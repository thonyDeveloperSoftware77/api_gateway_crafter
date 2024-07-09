import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseModule } from "../firebase/firebase.module";
import { ConfigModule } from "@nestjs/config";
import { SupabaseService } from "../supabase/supabase.service";

@Module({
  imports: [FirebaseModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, SupabaseService]
})
export class UsersModule {}
