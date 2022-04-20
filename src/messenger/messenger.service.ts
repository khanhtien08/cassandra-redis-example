import { Injectable } from '@nestjs/common';
import { MessengerRepository } from './messenger.repository';
import { MessengerEntity } from './messenger.entity';
import { CreateMessengerDto } from '../dto/messenger.dto';
import { randomUUID } from 'crypto';
import axios from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class MessengerService {
  constructor(private readonly messengerRepository: MessengerRepository) {}
  async create(createMessenger: CreateMessengerDto) {
    const payload: MessengerEntity = {
      id: randomUUID(),
      ...createMessenger,
    };
    const messenger = await this.messengerRepository.createMessenger(payload);
    return messenger;
  }

  async findById(id: string): Promise<MessengerEntity | Error> {
    try {
      const messenger = await this.messengerRepository.getMessenger(id);
      axiosRetry(axios, {
        retries: 5,
        retryDelay: axiosRetry.exponentialDelay,
      });
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts/1',
      );
      return messenger;
    } catch (e) {
      throw new Error(e.status);
    }
  }
  async update(id: string, content: string): Promise<MessengerEntity | Error> {
    return await this.messengerRepository.updateMessenger(id, content);
  }
  async delete(id: string) {
    return await this.messengerRepository.deleteMessenger(id);
  }
}
