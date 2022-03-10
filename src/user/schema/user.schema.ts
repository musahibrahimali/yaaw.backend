import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsBoolean, IsString } from "class-validator";
import mongoose from "mongoose";

export type UserModel = User & Document;

@Schema({timestamps: true })
export class User{
    @IsString()
    @Prop({required: false, default: '' })
    socialId: string;

    @IsString()
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: false, })
    password: string;

    @IsString()
    @Prop({required: false})
    displayName: string;

    @IsString()
    @Prop({ required: false })
    firstName: string;

    @IsString()
    @Prop({required: false})
    lastName: string;

    @IsString()
    @Prop({required: false, unique: true})
    email: string;

    @IsString()
    @Prop({required: false})
    salt: string;

    @Prop({required: false, default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})
    image: string;

    @IsArray()
    @Prop({required: false, default: ["user"]})
    roles: string[];

    @IsArray()
    @Prop({required: false, default: []})
    interest: string[];

    @IsArray()
    @Prop({required: false, default: []})
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}];

    @IsArray()
    @Prop({required: false, default: []})
    jobExperience: [{type: mongoose.Schema.Types.ObjectId, ref: 'JobExperience'}];

    @IsArray()
    @Prop({required: false, default: []})
    education: [{type: mongoose.Schema.Types.ObjectId, ref: 'Education'}];

    @IsBoolean()
    @Prop({required: false, default: false })
    isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
