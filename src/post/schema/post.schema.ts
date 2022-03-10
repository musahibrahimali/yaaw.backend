import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";

// post type
export type PostModel = Post & Document; 

// post schema
@Schema({ timestamps: true })
export class Post {
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

// post schema factory
export const PostSchema = SchemaFactory.createForClass(Post);
