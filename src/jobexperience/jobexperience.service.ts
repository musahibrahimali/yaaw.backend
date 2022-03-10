import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobExperience } from './schema/job.experience.schema';
import { Model } from 'mongoose';
import { JobExperienceDto } from './dto/job.experience.dto';
import IJobExperience from 'src/interface/job.experience.interface';

@Injectable()
export class JobExperienceService {
    constructor(
        @InjectModel(JobExperience.name) private jobExperienceModel: Model<JobExperience>,
    ) {}

    // create a new job experience
    async create(jobExperience: JobExperienceDto): Promise<IJobExperience | any> {
        const newJobExperience = new this.jobExperienceModel(jobExperience);
        return await newJobExperience.save();
    }

    // get all job experiences
    async findAll(): Promise<IJobExperience[] | any> {
        return await this.jobExperienceModel.find().exec();
    }

    // update job experience
    async update(jobExperience: JobExperienceDto, id: string): Promise<IJobExperience | any> {
        return await this.jobExperienceModel.findByIdAndUpdate(id, jobExperience, { new: true });
    }

    // delete job experience
    async delete(id: string): Promise<IJobExperience | any> {
        return await this.jobExperienceModel.findByIdAndRemove(id);
    }
}
