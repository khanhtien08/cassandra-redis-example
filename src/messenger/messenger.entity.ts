import { Column, Entity } from 'nestjs-express-cassandra';

@Entity<MessengerEntity>({
  table_name: 'messenger',
  key: ['id'],
})
export class MessengerEntity {
  @Column({ type: 'text', rule: { required: true } })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int' })
  timeout: number;
}
