import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {IsBoolean, IsDate, IsString } from "class-validator";

// job experience type
export type JobExperienceModel = JobExperience & Document;

// job experience schema
@Schema({ timestamps: true })
export class JobExperience {
    @IsString()
    @Prop({ required: true, unique: true })
    company: string;

    @IsString()
    @Prop({ required: false })
    position: string;

    @IsString()
    @Prop({ required: false })
    description: string;

    @IsDate()
    @Prop({ required: true })
    startDate: Date;

    @IsDate()
    @Prop({ required: false })
    endDate: Date;

    @IsBoolean()
    @Prop({ required: false })
    isCurrent: boolean;
}

// job experience schema factory
export const JobExperienceSchema = SchemaFactory.createForClass(JobExperience);
