import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from "dotenv";
import { UserModule } from 'src/user/user.module';
import { AdminModule } from '../admin/admin.module';
// configure dotenv
config();

// get the database url
const databaseUrl = process.env.DB_URL;

@Module({
  imports: [
    // configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      expandVariables: true,
      // validate stuff with Joi
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000),
      }),
      validationOptions: {
        // allow unknown keys (change to false to fail on unknown keys)
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    // connect to mongodb database
    MongooseModule.forRoot(databaseUrl), 
    // other modules
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
