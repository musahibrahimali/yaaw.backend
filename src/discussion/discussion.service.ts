import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Discussion, DiscussioModel } from './schema/discussion.schema';
import { Model } from 'mongoose';
import {IDiscussion} from 'src/interface/interfaces';
import { CreateDiscussionDto } from './dto/discussion.dto';

@Injectable()
export class DiscussionService {
    constructor(
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussioModel>,
    ) { }

    // Create a new discussion
    async createDiscussion(discussion: CreateDiscussionDto): Promise<IDiscussion | any> {
        const newDiscussion = new this.discussionModel(discussion);
        return await newDiscussion.save();
    }

    // Get all discussions
    async getDiscussions(): Promise<IDiscussion[] | any[]> {
        return await this.discussionModel.find().exec();
    }

    // Get a discussion by id
    async getDiscussion(discussionId: string): Promise<IDiscussion | any> {
        return await this.discussionModel.findById(discussionId).exec();
    }

    // get a discussion by user id
    async getDiscussionByUserId(userId: string): Promise<IDiscussion[] | any[]> {
        return await this.discussionModel.find({ userId }).exec();
    }

    // get a discussion by title
    async getDiscussionByTitle(title: string): Promise<IDiscussion | any> {
        return await this.discussionModel.findOne({ title }).exec();
    }

    // Update a discussion
    async updateDiscussion(discussionId: string, discussion: CreateDiscussionDto): Promise<IDiscussion | any> {
        return await this.discussionModel.findByIdAndUpdate(discussionId, discussion, { new: true }).exec();
    }

    // Delete a discussion
    async deleteDiscussion(discussionId: string): Promise<IDiscussion | any> {
        return await this.discussionModel.findByIdAndRemove(discussionId).exec();
    }
}
