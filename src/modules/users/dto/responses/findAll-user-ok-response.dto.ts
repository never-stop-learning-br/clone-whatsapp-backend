import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDTO } from '@/shared/dtos';

import { DataOkResponse } from './data-ok-response.dto';

export class FindAllUserOkResponseDto {
  @ApiProperty({ type: [DataOkResponse] })
  readonly data: DataOkResponse[];

  @ApiProperty()
  readonly meta: PaginationMetaDTO;

  constructor(data: Partial<FindAllUserOkResponseDto>) {
    Object.assign(this, data);
  }
}
