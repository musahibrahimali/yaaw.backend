import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EducationModel, Education } from './schema/education.schema';
import { CreateEducationDto } from './dto/education.dto';
import {IEducation} from 'src/interface/interfaces';

@Injectable()
export class EducationService {
    constructor(
        @InjectModel(Education.name) private educationModel: Model<EducationModel>
    ) {}
    // create a new education
    async create(education: CreateEducationDto): Promise<IEducation | any> {
        const newEducation = new this.educationModel(education);
        return await newEducation.save();
    }

    // get all educations
    async findAll(): Promise<IEducation[] | any> {
        return await this.educationModel.find().exec();
    }

    // update an education
    async update(education: CreateEducationDto, id: string): Promise<IEducation | any> {
        return await this.educationModel.findByIdAndUpdate(id, education, { new: true });
    }

    // delete an education
    async delete(id: string): Promise<IEducation | any> {
        return await this.educationModel.findByIdAndRemove(id);
    }
}
