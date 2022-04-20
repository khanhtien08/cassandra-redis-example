import { ConnectionOptions } from "nestjs-express-cassandra";

export const cassandraConfigs: ConnectionOptions= {
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'messenger',
    localDataCenter: 'datacenter1',
    queryOptions: {
      consistency: 1,
    },
  },
  ormOptions: {
    createKeyspace: true,
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1,
    },
    migration: 'safe',
  },
};
