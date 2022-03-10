import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';

@Module({
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
