import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Forum, ForumModel } from './schema/forum.scheme';
import { Model } from 'mongoose';
import {IForum} from 'src/interface/interfaces';
import { CreateForumDto } from './dto/create.forum.dto';
import { DiscussionService } from 'src/discussion/discussion.service';
import { CreateDiscussionDto } from 'src/discussion/dto/discussion.dto';

@Injectable()
export class ForumService {
    constructor(
        @InjectModel(Forum.name) private forumModel: Model<ForumModel>,
        private discussionService: DiscussionService,
    ) {}

    // create forum
    async create(forum: CreateForumDto): Promise<IForum | any> {
        return await this.forumModel.create(forum);
    }

    // get all forums
    async findAll(): Promise<IForum[] | any[]> {

        const forums = await this.forumModel.find().populate('discussions').exec();
        // // get all  the forums
        // const forums = await this.forumModel.find();
        // let allDiscussions = [];

        // // get all the discussions
        // const discussions = await this.discussionService.getDiscussions();
        // // populate the discussions to the forums
        // forums.forEach(forum => {
        //     allDiscussions = discussions.filter(discussion => discussion.postId === forum._id);
        // });

        // // return the forums with the discussions
        // return forums.map(forum => {
        //     return {
        //         ...forum.toObject(),
        //         discussions: allDiscussions.filter(discussion => discussion.postId === forum._id),
        //     };
        // });
        return forums;
    }

    // create a discussion
    async createDiscussion(id: string, discussion: CreateDiscussionDto): Promise<IForum | any> {
        const forum = await this.forumModel.findById(id);
        if (!forum) {
            return null;
        }
        const newDiscussion = await this.discussionService.createDiscussion(discussion);
        // add discussion to forum
        forum.discussions.push(newDiscussion._id);
        // save the forum
        await forum.save();
        return forum;
    }

    // update discussion
    async updateDiscussion(id: string, discussionId: string, discussion: CreateDiscussionDto): Promise<IForum | any> {
        const forum = await this.forumModel.findById(id);
        if (!forum) {
            return null;
        }
        const newDiscussion = await this.discussionService.updateDiscussion(discussionId, discussion);
        // add discussion to forum
        forum.discussions.push(newDiscussion._id);
        // save the forum
        await forum.save();
        return forum;
    }

    // delete discussion
    async deleteDiscussion(id: string, discussionId: string): Promise<IForum | any> {
        const forum = await this.forumModel.findById(id);
        if (!forum) {
            return null;
        }
        const discussion = await this.discussionService.deleteDiscussion(discussionId);
        // remove discussion from forum
        forum.discussions.splice(discussion._id);
        // save forum
        await forum.save();
        return forum;
    }

    // get forum by id
    async findById(id: string): Promise<IForum | any> {
        return await this.forumModel.findOne({_id: id}).populate('discussions').exec();
    }

    // update forum
    async update(id: string, forum: CreateForumDto): Promise<IForum | any> {
        return await this.forumModel.findByIdAndUpdate(id, forum, { new: true });
    }

    // delete forum
    async delete(id: string): Promise<IForum | any> {
        return await this.forumModel.findByIdAndDelete(id);
    }
}
