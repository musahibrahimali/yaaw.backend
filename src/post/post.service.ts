import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModel } from './schema/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create.post.dto';
import IPost from 'src/interface/post.interface';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostModel>,
    ) {}

    // create a new post
    async create(post: CreatePostDto): Promise<IPost | any> {
        const newPost = new this.postModel(post);
        return await newPost.save();
    }

    // get all posts
    async findAll(): Promise<IPost[] | any> {
        return await this.postModel.find().exec();
    }

    // update post
    async update(post: CreatePostDto, id: string): Promise<IPost | any> {
        return await this.postModel.findByIdAndUpdate(id, post, { new: true });
    }

    // delete post
    async delete(id: string): Promise<IPost | any> {
        return await this.postModel.findByIdAndRemove(id);
    }
}
