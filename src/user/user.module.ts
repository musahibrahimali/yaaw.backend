import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/constants/constants';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtStrategy } from 'src/authorization/authorizations';
import { FacebookStrategy, GoogleStrategy } from './strategies/strategies';
import { JobExperienceModule } from 'src/jobexperience/jobexperience.module';
import { EducationModule } from 'src/education/education.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    // other modules
    JobExperienceModule,
    EducationModule,
    PostModule,
    
    // passport module
    PassportModule,

    // jwt module
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),

    // monogoose module
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],

  // providers
  providers: [
    UserService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],

  // controllers
  controllers: [UserController],
  // export user service
  exports: [UserService],
})
export class UserModule {}
