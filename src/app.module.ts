import { Module } from '@nestjs/common';
import { MessengerModule } from './messenger/messenger.module';
import {
  ExpressCassandraModule,
  ExpressCassandraModuleOptions,
} from 'nestjs-express-cassandra';
import { cassandraConfigs } from './config/cassandra.config';

@Module({
  imports: [
    MessengerModule,
    ExpressCassandraModule.forRoot(
      <ExpressCassandraModuleOptions>cassandraConfigs,
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
