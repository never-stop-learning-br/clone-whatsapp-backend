import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { RemoveFieldsInterceptor } from '@/interceptors';

import { CreateUserDTO, UpdateUserDTO } from './dto';
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
  public findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
