import { Document } from "mongoose";

interface IPost extends Document {
    readonly _id: string;
    readonly title: string;
    readonly content: string;
    readonly images: string[];
    readonly videos: string[];
    readonly userId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export default IPost;