import { ApiProperty } from '@nestjs/swagger';

export class FindByIdErrorResponseDto {
  @ApiProperty({
    type: String,
    description: 'Status code',
  })
  public readonly status: string;

  @ApiProperty({
    type: String,
    description: 'Error message',
  })
  public readonly message: string;
}
