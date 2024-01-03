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

  public async create(createUserDto: CreateUserDTO): Promise<User> {
    const { password, ...dto } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userModel.create({
      password: hashedPassword,
      ...dto,
    });

    delete user.password;

    return user;
  }

  public findAll() {
    return `This action returns all users`;
  }

  public findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  public update(id: string, updateUserDto: UpdateUserDTO) {
    console.log({ updateUserDto });

    return `This action updates a #${id} user`;
  }

  public softDelete(id: string) {
    return `This action removes a #${id} user`;
  }
}
