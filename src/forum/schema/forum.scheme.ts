import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsString } from "class-validator";
import mongoose from "mongoose";

export type ForumModel = Forum & Document;

// forum schema
@Schema({ timestamps: true })
export class Forum {
    @IsString()
    @Prop({ required: true })
    topic: string;

    @IsString()
    @Prop({ required: false })
    description: string; 

    @IsString()
    @Prop({ required: false })
    images: string[];

    @IsString()
    @Prop({ required: false })
    videos: string[];

    @IsArray()
    @Prop({ required: false })
    discussions: [{type: mongoose.Types.ObjectId, ref: 'Discussion'}];
}

// forum schema factory
export const ForumSchema = SchemaFactory.createForClass(Forum);