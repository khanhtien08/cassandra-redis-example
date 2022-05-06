import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { MessengerRepository } from './messenger.repository';
import { MessengerEntity } from './messenger.entity';
import { CreateMessengerDto } from '../dto/messenger.dto';
import { randomUUID } from 'crypto';
import { Cache } from 'cache-manager';
import { createDeflateRaw } from 'zlib';

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
    if (timeout == null) {
      return await this.messengerRepository.updateMessenger(
        id,
        content,
        timeout,
      );
    } else {
      await this.cacheManager.set(id, content, {
        ttl: timeout,
      });
      await this.cacheManager.get(id);
      await this.nrpClient.on('__keyevent@0__:expired', (data) => {
        console.log(data);
        return this.messengerRepository.deleteMessenger(data);
      });
      return await this.messengerRepository.updateMessenger(
        id,
        content,
        timeout,
      );
    }
  }
  async delete(id: string): Promise<Error> {
    return await this.messengerRepository.deleteMessenger(id);
  }
}
