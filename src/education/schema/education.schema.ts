import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsDate, IsString } from "class-validator";

export type EducationModel = Education & Document;

// education schema
@Schema({ timestamps: true })
export class Education {
    @IsString()
    @Prop({ required: true })
    school: string;

    @IsString()
    @Prop({ required: false })
    degree: string;

    @IsString()
    @Prop({ required: false })
    fieldOfStudy: string;

    @IsString()
    @Prop({ required: false })
    grade: string;

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

// education schema factory
export const EducationSchema = SchemaFactory.createForClass(Education);