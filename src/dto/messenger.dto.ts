import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateMessengerDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ required: false })
  timeout: number;
}
