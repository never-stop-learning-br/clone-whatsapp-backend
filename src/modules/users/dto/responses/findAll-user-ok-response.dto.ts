import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDTO } from '@/shared/dtos';

import { DataOkResponse } from './data-ok-response.dto';

export class FindAllUserOkResponseDto {
  @ApiProperty({ type: [DataOkResponse] })
  public readonly data: DataOkResponse[];

  @ApiProperty()
  public readonly meta: PaginationMetaDTO;

  public constructor(data: Partial<FindAllUserOkResponseDto>) {
    Object.assign(this, data);
  }
}
