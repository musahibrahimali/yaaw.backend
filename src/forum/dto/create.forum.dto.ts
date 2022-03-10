import mongoose from 'mongoose';
export class CreateForumDto {
    readonly topic: string;
    readonly description: string;
    readonly images: string[] | string;
    readonly videos: string[] | string;
    readonly discussion: mongoose.Types.ObjectId[];
}