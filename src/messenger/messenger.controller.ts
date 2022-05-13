import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { MessengerService } from './messenger.service';
import { CreateMessengerDto } from '../dto/messenger.dto';

@Controller('messenger')
export class MessengerController {
  constructor(private messengerService: MessengerService) {}

  @Post()
  async createMessenger(@Body() createMessenger: CreateMessengerDto) {
    console.log(createMessenger);
    return this.messengerService.insert(createMessenger);
  }

  @Delete(':id')
  async deleteMessenger(@Param() messenger: CreateMessengerDto) {
    return await this.messengerService.delete(messenger.id);
  }

  @Put()
  async updateMessenger(@Body() messenger: CreateMessengerDto) {
    return await this.messengerService.update(messenger);
  }

  @Get('search')
  async searchMessenger(@Body() search: string) {
    const content = search['mess_content'];

    return await this.messengerService.search(content);
  }
}
