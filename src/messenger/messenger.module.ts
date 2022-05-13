import { CacheModule, Module, OnModuleInit } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import * as redisStore from 'cache-manager-redis-store';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://10.10.15.21:9200',
      maxRetries: 5,
      requestTimeout: 60000,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [MessengerService],
  controllers: [MessengerController],
})
export class MessengerModule implements OnModuleInit {
  constructor(private readonly elasticsearchService: MessengerService) {}
  public async onModuleInit() {
    await this.elasticsearchService.createIndexMessenger();
  }
}
