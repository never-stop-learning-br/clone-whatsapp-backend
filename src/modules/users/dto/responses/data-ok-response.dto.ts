import { ApiProperty } from '@nestjs/swagger';

import { TimestampDTO } from '@/shared/dtos/responses/timestamped.dto';

export class DataOkResponse extends TimestampDTO {
  @ApiProperty({
    type: String,
    description: 'Unique "username" in the application',
  })
  public readonly username: string;

  @ApiProperty({
    type: String,
    description: 'Unique "email" in the application',
  })
  public readonly email: string;

  @ApiProperty({
    type: String,
    description: 'Unique "_id" in the application',
  })
  public readonly _id: string;
}
