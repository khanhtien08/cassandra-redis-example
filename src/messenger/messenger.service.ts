import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import * as NRP from 'node-redis-pubsub';
import { MessengerEntity } from './messenger.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MessengerService {
  index = 'messengers';
  private nrpClient = new NRP();

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async createMessenger() {
    const checkIndex = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (!checkIndex) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
          mappings: {
            properties: {
              id: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              content: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              timeout: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
            },
          },
          settings: {
            analysis: {
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'autocomplete_filter'],
                },
              },
            },
          },
        },
      });
    }
  }

  async indexMessenger(message: MessengerEntity) {
    return await this.elasticsearchService.index({
      index: this.index,
      body: {
        id: randomUUID(),
        content: message.content,
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

    return hits.map((item) => item._source);
  }

  async delete(messId: string) {
    const mess = await this.elasticsearchService.delete({
      index: this.index,
      id: messId,
    });

    return mess;
  }
}
