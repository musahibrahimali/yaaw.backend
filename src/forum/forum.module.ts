import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, ForumSchema } from './schema/forum.scheme';
import { DiscussionModule } from 'src/discussion/discussion.module';

@Module({
  imports: [
    DiscussionModule,
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }]),
    // mongose module
    MongooseModule.forFeature([
      {name: Forum.name, schema: ForumSchema},
    ])
  ],
  providers: [ForumService],
  controllers: [ForumController],
  exports: [ForumService],
})
export class ForumModule {}
