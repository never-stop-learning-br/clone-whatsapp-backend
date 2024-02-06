import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FindOneFilterDTO {
  @ApiPropertyOptional({
    type: String,
    description: 'Unique "username" in the application',
    minLength: 4,
    maxLength: 32,
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(32)
  @IsAlphanumeric()
  @IsString()
  @IsOptional()
  public readonly username?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Unique "email" in the application',
    minLength: 8,
    maxLength: 256,
  })
  @MinLength(8)
  @MaxLength(256)
  @IsEmail()
  @IsOptional()
  public readonly email?: string;
}
