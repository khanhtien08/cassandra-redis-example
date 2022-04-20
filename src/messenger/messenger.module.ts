import { Module } from '@nestjs/common';
import { ExpressCassandraModule } from 'nestjs-express-cassandra';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { MessengerEntity } from './messenger.entity';
import { MessengerRepository } from './messenger.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ExpressCassandraModule.forFeature([MessengerEntity]), HttpModule],
  providers: [MessengerService, MessengerRepository],
  controllers: [MessengerController],
})
export class MessengerModule {}
