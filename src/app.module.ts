import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { SupabaseService } from './supabase/supabase.service';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    SupabaseService,
    UsersModule,
  ],
})
export class AppModule {}
