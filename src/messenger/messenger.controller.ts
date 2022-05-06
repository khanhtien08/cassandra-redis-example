import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { CreateMessengerDto } from '../dto/messenger.dto';
import { MessengerEntity } from './messenger.entity';
import { HttpService } from '@nestjs/axios';

const KEY = 'hello';
@Controller('messenger')
export class MessengerController {
  constructor(
    private messengerService: MessengerService,
    private http: HttpService,
  ) {}

  @Post()
  async createMessenger(@Body() createMessenger: CreateMessengerDto) {
    return this.messengerService.create(createMessenger);
  }

  @Get(':userId')
  async findMessenger(
    @Param('userId') userId: string,
  ): Promise<MessengerEntity | Error> {
    return await this.messengerService.findId(userId);
  }
  @Delete(':id')
  async deleteMessenger(
    @Param() messenger: CreateMessengerDto,
  ): Promise<Error> {
    return await this.messengerService.delete(messenger.id);
  }

  @Put()
  async updateMessenger(
    @Body() messing: CreateMessengerDto,
  ): Promise<MessengerEntity | Error> {
    return await this.messengerService.update(
      messing.id,
      messing.content,
      messing.timeout,
    );
  }
}
