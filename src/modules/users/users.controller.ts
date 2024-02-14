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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RemoveFieldsInterceptor } from '@/interceptors';
import { PaginationOptionsDTO } from '@/shared/dtos';

import { CreateUserDTO, FindUserDTO, UpdateUserDTO } from './dto';
import { CreateUserOkResponseDto } from './dto/responses/create-user-ok-response.dto';
import { FindByIdErrorResponseDto } from './dto/responses/find-by-id-error-response.dto';
import { FindByIdUserOkResponseDto } from './dto/responses/find-by-id-ok-response.dto';
import { FindAllUserOkResponseDto } from './dto/responses/findAll-user-ok-response.dto';
import { SoftDeleteUserOkResponseDto } from './dto/responses/soft-delete-ok-response.dto';
import { UpdateUserOkResponseDto } from './dto/responses/update-user-ok-response.dto';
import { SortUserDTO } from './dto/sort-user.dto';
import { User } from './entities';
import { UsersSortValidationPipe } from './users-sort-validation';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create user',
    description:
      'This request creates a user given email, password and username',
  })
  @ApiResponse({
    description: 'Create use response',
    type: CreateUserOkResponseDto,
    status: 201,
  })
  @Post()
  @UseInterceptors(new RemoveFieldsInterceptor<User>(['password']))
  public createOne(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createOne(createUserDto);
  }

  @ApiOperation({
    summary: 'Find All users without or by filter',
    description:
      'This request finds all users if no filter is passed, or finds a specific user by passing email or username using sorting by username or createdAT',
  })
  @ApiResponse({
    description: 'find all user response',
    type: FindAllUserOkResponseDto,
    status: 200,
  })
  @Get()
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'Parametro para fazer sorting',
    example: '{"createdAt":-1,"username":-1}',
    required: false,
  })
  public findAll(
    @Query() pagination: PaginationOptionsDTO,
    @Query() filter: FindUserDTO,
    @Query('sort', new UsersSortValidationPipe()) sort: SortUserDTO,
  ) {
    return this.usersService.findAll({ filter, pagination, sort });
  }

  @ApiOperation({
    summary: 'Find user by id',
    description: 'This request find user passing id',
  })
  @ApiResponse({
    description: 'find user by id ok response',
    type: FindByIdUserOkResponseDto,
    status: 200,
  })
  @ApiResponse({
    description: 'find user by id error response',
    type: FindByIdErrorResponseDto,
    status: 404,
  })
  @Get(':id')
  public findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({
    summary: 'Update one user by id',
    description:
      'This request update only "username" or "password" from user entity with given id',
  })
  @ApiResponse({
    description: 'update user by id response',
    type: UpdateUserOkResponseDto,
    status: 200,
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
  @ApiResponse({
    description: 'Delete user by id response',
    type: SoftDeleteUserOkResponseDto,
    status: 200,
  })
  @Delete(':id')
  @UseInterceptors(new RemoveFieldsInterceptor<User>(['password']))
  public softDeleteById(@Param('id') id: string) {
    return this.usersService.softDeleteById(id);
  }
}
