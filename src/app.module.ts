import { Module } from '@nestjs/common';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [MessengerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
