import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { CONNECTION_NAME_MAIN } from '@/shared/constants/database';
import {
  PaginationDTO,
  PaginationMetaDTO,
  PaginationOptionsDTO,
} from '@/shared/dtos';

import { CreateUserDTO, FindUserDTO, UpdateUserDTO } from './dto';
import { SortUserDTO } from './dto/sort-user.dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name, CONNECTION_NAME_MAIN)
    private readonly userModel: Model<User>,
  ) {}

  private async hashPassword(password: string) {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  public async createOne(createUserDto: CreateUserDTO): Promise<User> {
    const { password, ...dto } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userModel.create({
      password: hashedPassword,
      ...dto,
    });

    return user;
  }

  public async findAll({
    filter: { email, username } = {},
    pagination: { page, size },
    sort = {},
  }: {
    filter: FindUserDTO;
    pagination: PaginationOptionsDTO;
    sort: SortUserDTO;
  }) {
    const query: FilterQuery<User> = {};
    const options: QueryOptions<User> = {
      limit: size,
      skip: (page - 1) * size,
      sort,
    };

    if (username) query.username = new RegExp(`${username}`, 'gi');
    if (email) query.email = new RegExp(`${email}`, 'gi');

    const total = await this.userModel.countDocuments(query);

    const data = await this.userModel.find(query, { password: 0 }, options);
    const meta = new PaginationMetaDTO({ page, size, total });

    const pagination = new PaginationDTO(data, meta);
    return pagination;
  }

  public async findOneById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  public async updateOneById(id: string, updateUserDto: UpdateUserDTO) {
    const { password, ...dto } = updateUserDto;

    const updateFields: Partial<
      Record<keyof UpdateUserDTO, UpdateUserDTO[keyof UpdateUserDTO]>
    > = dto;
    if (password) {
      const hashedPassword = await this.hashPassword(password);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true },
    );
    return updatedUser;
  }

  public async softDeleteById(id: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
    return updatedUser;
  }
}
