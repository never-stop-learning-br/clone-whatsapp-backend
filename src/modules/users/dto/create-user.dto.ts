import { ApiProperty } from '@nestjs/swagger';

import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { User } from '../entities';

type UserDTO = {
  [K in keyof User]: User[K];
};

export class CreateUserDTO implements UserDTO {
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
  public username: string;

  @ApiProperty({
    type: String,
    description: 'Unique "email" in the application',
    minLength: 8,
    maxLength: 256,
  })
  @MinLength(8)
  @MaxLength(256)
  @IsEmail()
  public email: string;

  @ApiProperty({
    type: String,
    description:
      'The password must contain at least one letter, one number and one special character',
    minLength: 6,
    maxLength: 256,
  })
  @MinLength(6)
  @MaxLength(256)
  @IsStrongPassword()
  public password: string;

  @IsOptional()
  @IsDate()
  public deletedAt: Date;
}
