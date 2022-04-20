import { ApiProperty } from '@nestjs/swagger';

export class CreateMessengerDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ required: false })
  timeout: number;
}
