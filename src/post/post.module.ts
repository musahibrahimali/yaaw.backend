import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Post.name, schema: PostSchema},
    ])
  ],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
