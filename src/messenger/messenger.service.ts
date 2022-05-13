import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as NRP from 'node-redis-pubsub';
import { MessengerEntity } from './messenger.entity';
import { randomUUID } from 'crypto';
import { CreateMessengerDto } from '../dto/messenger.dto';

@Injectable()
export class MessengerService {
  index = 'messengers';
  private nrpClient = new NRP();

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async createIndexMessenger() {
    const checkIndex = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (!checkIndex) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
          settings: {
            analysis: {
              filter: {
                my_ascii_folding: {
                  type: 'asciifolding',
                  preserve_original: true,
                },
              },
              analyzer: {
                my_folding: {
                  type: 'custom',
                  filter: ['lowercase', 'my_ascii_folding'],
                  tokenizer: 'standard',
                },
              },
            },
          },
          mappings: {
            properties: {
              id: {
                type: 'keyword',
              },
              content: {
                type: 'text',
                analyzer: 'my_folding',
                search_analyzer: 'standard',
              },
              timeout: {
                type: 'text',
              },
            },
          },
        },
      });
    }
  }

  async insert(message: MessengerEntity) {
    return await this.elasticsearchService.index({
      index: this.index,
      body: {
        id: randomUUID(),
        content: message.content,
        content_ascii: message.content,
        timeout: message.timeout,
      },
    });
  }

  async search(text: string) {
    const body = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['content'],
          },
        },
      },
    });

    const hits = body.hits.hits;
    console.log(hits);
    return hits.map((item) => item._source);
  }

  async update(mess: CreateMessengerDto) {
    const payload: MessengerEntity = {
      id: mess.id,
      content: mess.content,
      timeout: mess.timeout,
    };

    return await this.elasticsearchService.update({
      index: this.index,
      id: mess.id,
      body: {
        doc: payload,
      },
    });
  }

  async delete(messId: string) {
    return await this.elasticsearchService.delete({
      index: this.index,
      id: messId,
    });
  }
}
