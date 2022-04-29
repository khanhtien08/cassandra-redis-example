import { CacheModule, Module } from '@nestjs/common';
import { ExpressCassandraModule } from 'nestjs-express-cassandra';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { MessengerEntity } from './messenger.entity';
import { MessengerRepository } from './messenger.repository';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ExpressCassandraModule.forFeature([MessengerEntity]),
    HttpModule.register({
      timeout: 1000,
      maxRedirects: 4,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [MessengerService, MessengerRepository],
  controllers: [MessengerController],
})
export class MessengerModule {}
