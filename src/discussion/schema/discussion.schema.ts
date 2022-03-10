import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from 'mongoose';

export type DiscussioModel =  Discussion & Document;

// discussion schema
@Schema({ timestamps: true })
export class Discussion {
    @IsString()
    @Prop({ required: true })
    title: string;

    @IsString()
    @Prop({ required: false })
    content: string;

    @IsString()
    @Prop({ required: false })
    images: string[];

    @IsString()
    @Prop({ required: false })
    videos: string[];

    // user id
    @IsString()
    @Prop({ required: true })
    userId: mongoose.Types.ObjectId;
}

// discussion schema factory
export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
