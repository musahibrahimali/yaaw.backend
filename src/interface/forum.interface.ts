import {Document} from "mongoose";

interface IForum extends Document {
    readonly topic: string;
    readonly description: string;
    readonly images: string[];
    readonly videos: string[];
    readonly discussion: [{type: string, ref: 'Discussion'}];
}

export default IForum;
