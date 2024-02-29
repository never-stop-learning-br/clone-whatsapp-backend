import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CONNECTION_NAME_MAIN } from '@/shared/constants/database';

import { UserDefinition } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([UserDefinition], CONNECTION_NAME_MAIN)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
