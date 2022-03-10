import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Education, EducationSchema } from './schema/education.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Education.name, schema: EducationSchema },
    ])
  ],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
