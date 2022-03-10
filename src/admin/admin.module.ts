import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/authorization/authorizations';
import { jwtConstants } from 'src/constants/constants';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './schemas/admin.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: jwtConstants.expiresIn},
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtStrategy,
  ],
})
export class AdminModule {}
