import { ApiProperty } from '@nestjs/swagger';

import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FindOneFilterDTO {
  @ApiProperty({
    type: String,
    description: 'Unique "username" in the application',
    minLength: 4,
    maxLength: 32,
  })
  @MinLength(4)
  @MaxLength(32)
  @IsAlphanumeric()
  @IsString()
  public username?: string;

  @ApiProperty({
    type: String,
    description: 'Unique "email" in the application',
    minLength: 8,
    maxLength: 256,
  })
  @MinLength(8)
  @MaxLength(256)
  @IsEmail()
  public email?: string;
}
