import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { MessengerRepository } from './messenger.repository';
import { MessengerEntity } from './messenger.entity';
import { CreateMessengerDto } from '../dto/messenger.dto';
import { randomUUID } from 'crypto';
import { Cache } from 'cache-manager';

const NRP = require('node-redis-pubsub');

@Injectable()
export class MessengerService {
  private nrpClient = new NRP();
  constructor(
    private readonly messengerRepository: MessengerRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async findId(id: string): Promise<MessengerEntity | Error> {
    return await this.messengerRepository.getMessenger(id);
  }
  async create(createMessenger: CreateMessengerDto) {
    const payload: MessengerEntity = {
      id: randomUUID(),
      ...createMessenger,
    };
    if (payload.timeout == null) {
      return await this.messengerRepository.createMessenger(payload);
    } else {
      await this.cacheManager.set(payload.id, payload.content, {
        ttl: payload.timeout,
      });
      await this.cacheManager.get(payload.id);
      await this.nrpClient.on('__keyevent@0__:expired', (data) => {
        console.log(data);
      });
      return await this.messengerRepository.createMessenger(payload);
    }
  }
  async update(
    id: string,
    content: string,
    timeout: number,
  ): Promise<MessengerEntity | Error> {
    return await this.messengerRepository.updateMessenger(id, content, timeout);
  }
  async delete(id: string) {
    return await this.messengerRepository.deleteMessenger(id);
  }
}
