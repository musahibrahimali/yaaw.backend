import { Module } from '@nestjs/common';
import { JobExperienceService } from './jobexperience.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobExperience, JobExperienceSchema } from './schema/job.experience.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobExperience.name, schema: JobExperienceSchema },
    ])
  ],
  providers: [JobExperienceService],
  exports: [JobExperienceService],
})
export class JobExperienceModule {}
