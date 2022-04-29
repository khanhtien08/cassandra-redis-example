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
import { RpcException } from '@nestjs/microservices/exceptions/rpc-exception';
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
    this.messengerService.create(createMessenger);
  }

  @Get(':userId')
  async findMessenger(
    @Param('userId') userId: string,
  ): Promise<MessengerEntity | Error> {
    return await this.messengerService.findId(userId);
  }
  @Delete(':id')
  async deleteMessenger(@Param() messenger: CreateMessengerDto) {
    const mess = await this.messengerService.delete(messenger.id);
    return mess;
  }

  @Put(':id')
  async updateMessenger(
    @Body() messing: CreateMessengerDto,
  ): Promise<MessengerEntity> {
    try {
      const mess = await this.messengerService.update(
        messing.id,
        messing.content,
      );
      if (mess instanceof Error) throw mess;
      return mess;
    } catch (e) {
      throw new RpcException(e as string);
    }
  }
  // @Get()
  // async getHello(): Promise<string> {
  //   return await this.messengerService.readIdMessenger();
  // }
}
