import { Document } from "mongoose";
import mongoose from 'mongoose';

interface IUser extends Document {
    readonly socialId?: string;
    readonly username: string;
    readonly email?: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly password?: string;
    readonly image?: string;
    readonly salt?: string;
    readonly post?: mongoose.Types.ObjectId[];
    readonly education?: mongoose.Types.ObjectId[];
    readonly jobExperience?: mongoose.Types.ObjectId[];
    readonly roles?: string[],
    readonly isAdmin?: boolean,
}

export default IUser;