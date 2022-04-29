import { MessengerEntity } from './messenger.entity';
import { Logger } from '@nestjs/common';
import {
  BaseModel,
  BaseRepository,
  InjectModel,
  Repository,
} from 'nestjs-express-cassandra';
import { CreateMessengerDto } from '../dto/messenger.dto';

@Repository(MessengerEntity)
export class MessengerRepository extends BaseRepository<MessengerEntity> {
  private readonly logger = new Logger(MessengerRepository.name);
  constructor(
    @InjectModel(MessengerEntity)
    private readonly messengerEntity: BaseModel<MessengerEntity>,
  ) {
    super();
  }
  public async getMessenger(id: string): Promise<MessengerEntity | Error> {
    return (await this.messengerEntity.findOneAsync({ id: id })).toJSON();
  }

  public async createMessenger(
    payload: CreateMessengerDto,
  ): Promise<MessengerEntity | Error> {
    try {
      const messenger = new this.messengerEntity({
        ...payload,
      });
      await messenger.saveAsync({ ttl: payload.timeout });
      return messenger.toJSON();
    } catch (e) {
      this.logger.error(e);
      return new Error('Could not create user!');
    }
  }
  public async updateMessenger(
    id: string,
    content: string,
  ): Promise<MessengerEntity | Error> {
    try {
      await this.messengerEntity.updateAsync({ id: id }, { content: content });
      return (await this.messengerEntity.findOneAsync({ id: id })).toJSON();
    } catch (e) {
      this.logger.error(e);
      return new Error('khum cap nhat dc be oii!');
    }
  }

  public async deleteMessenger(id: string): Promise<Error> {
    try {
      await this.messengerEntity.deleteAsync({ id: id });
    } catch (e) {
      this.logger.error(e);
      return new Error('khum xoa duoc');
    }
  }
}
