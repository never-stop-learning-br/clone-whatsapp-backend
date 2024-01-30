import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { RemoveFieldsInterceptor } from '@/interceptors';
import { PaginationOptionsDTO } from '@/shared/dtos';

import { CreateUserDTO, FindUserDTO, UpdateUserDTO } from './dto';
import { User } from './entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(new RemoveFieldsInterceptor<User>(['password']))
  public createOne(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createOne(createUserDto);
  }

  @Get()
  public findAll(
    @Query() pagination: PaginationOptionsDTO,
    @Query() filter: FindUserDTO,
  ) {
    return this.usersService.findAll({ filter, pagination });
  }

  @Get(':id')
  public findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Update one user by id',
    description:
      'This request update only "username" or "password" from user entity with given id',
  })
  @Patch(':id')
  @UseInterceptors(new RemoveFieldsInterceptor<User>(['password']))
  public updateOneById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.updateOneById(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'SoftDelete one user by id',
    description:
      'This request update the field "deletedAt" with the current date making the user deleted',
  })
  @Delete(':id')
  @UseInterceptors(new RemoveFieldsInterceptor<User>(['password']))
  public softDeleteById(@Param('id') id: string) {
    return this.usersService.softDeleteById(id);
  }
}
