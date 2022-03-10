import { Body, Controller } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDto } from './dto/create.forum.dto';
import { IForum } from 'src/interface/interfaces';

@Controller('forum')
export class ForumController {
    constructor(
        private forumService: ForumService,
    ) {}

    // create forum
    async create(@Body() createForumDto: CreateForumDto): Promise<IForum | any> {
        return await this.forumService.create(createForumDto);
    }

    // get all forums
    async findAll(): Promise<IForum[] | any[]> {
        return await this.forumService.findAll();
    }

    // create a discussion
    async createDiscussion(id: string, discussion: any): Promise<IForum | any> {
        return await this.forumService.createDiscussion(id, discussion);
    }

    // get forum by id
    async findById(id: string): Promise<IForum | any> {
        return await this.forumService.findById(id);
    }

    // update forum
    async update(id: string, forum: CreateForumDto): Promise<IForum | any> {
        return await this.forumService.update(id, forum);
    }

    // delete forum
    async delete(id: string): Promise<IForum | any> {
        return await this.forumService.delete(id);
    }
}
