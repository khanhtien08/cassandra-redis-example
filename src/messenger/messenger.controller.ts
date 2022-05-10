import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { CreateMessengerDto } from '../dto/messenger.dto';
import { MessengerEntity } from './messenger.entity';

@Controller('messenger')
export class MessengerController {
  constructor(private messengerService: MessengerService) {}

  @Post()
  async createMessenger(@Body() createMessenger: CreateMessengerDto) {
    return this.messengerService.indexMessenger(createMessenger);
  }

  @Delete(':id')
  async deleteMessenger(@Param() messenger: CreateMessengerDto) {
    return await this.messengerService.delete(messenger.id);
  }

  @Get('search')
  async searchMessenger(@Body() search: string) {
    const content = search['mess_content'];

    return await this.messengerService.search(content);
  }
}
