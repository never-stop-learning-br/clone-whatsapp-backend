import { OmitType } from '@nestjs/swagger';

import { DataOkResponse } from './data-ok-response.dto';

export class UpdateUserOkResponseDto extends OmitType(DataOkResponse, [
  'deletedAt',
] as const) {}
