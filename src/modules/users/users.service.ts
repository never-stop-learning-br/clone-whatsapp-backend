import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CONNECTION_NAME_MAIN } from '@/shared/constants/database';

import { CreateUserDTO, UpdateUserDTO } from './dto';
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

  public findAll() {
    // return `This action returns all users`;
    return this.userModel.find();
  }

  public findOne(id: string) {
    return `This action returns a #${id} user`;
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
      {
        deletedAt: new Date(),
      },
      { new: true },
    );
    return updatedUser;
  }
}
