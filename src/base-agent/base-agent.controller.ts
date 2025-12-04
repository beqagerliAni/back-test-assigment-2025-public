import { Get, MessageEvent, Param, Post, Query, Sse } from '@nestjs/common';
import { BaseAgentService } from './base-agent.service';
import { Observable } from 'rxjs';
//i know it dose not has any auth system just did not had time to build that to
export abstract class BaseAgentController {
  constructor(private baseAgentService: BaseAgentService) {}

  // create post thread api 
  @Post('createThread')
  async createThread() {
    return await this.baseAgentService.createThread();
  }

  @Sse(':threadId')
  sendStreamMessage(
    @Param('threadId') threadId: string,
    @Query('message') message: string,
  ): Promise<Observable<MessageEvent>> {
    return this.baseAgentService.sendStreamMessage(message, threadId);
  }
  
  //get conversation from ther db
  @Get('messages/:threadId')
  async getMessages(@Param('threadId') threadId: string) {
    return this.baseAgentService.getMessage(threadId)
  }
}
