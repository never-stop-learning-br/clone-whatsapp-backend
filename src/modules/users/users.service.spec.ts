import { Provider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { FilterQuery, QueryOptions } from 'mongoose';

import { CONNECTION_NAME_MAIN } from '@/shared/constants/database';
import {
  PaginationDTO,
  PaginationMetaDTO,
  PaginationOptionsDTO,
} from '@/shared/dtos';
import { createToday } from '@/shared/tests/utils';

import { CreateUserDTO, FindUserDTO, SortUserDTO } from './dto';
import { User } from './entities';
import { UsersService } from './users.service';

describe(UsersService.name, () => {
  let service: UsersService;

  const userModelMock = {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
  };

  const mockedProviders: Provider[] = [
    {
      provide: getModelToken(User.name, CONNECTION_NAME_MAIN),
      useValue: userModelMock,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ...mockedProviders],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.resetAllMocks();
  });

  describe('createOne', () => {
    it('should create one user', async () => {
      // ? ARRANGE
      const rounds = 10;
      const dto = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as CreateUserDTO;

      const spiedBcryptGenSalt = jest.spyOn(bcrypt, 'genSalt');
      const spiedBcryptHash = jest.spyOn(bcrypt, 'hash');

      const genSaltReturnedValue = faker.string.uuid();
      const hashReturnedValue = faker.string.uuid();

      spiedBcryptGenSalt.mockImplementationOnce(() => genSaltReturnedValue);
      spiedBcryptHash.mockImplementationOnce(() => hashReturnedValue);

      const createdUser = {
        ...dto,
        password: hashReturnedValue,
      };

      const createArgs = {
        ...dto,
        password: hashReturnedValue,
      };

      userModelMock.create.mockImplementationOnce(() => createdUser);

      const expectedValue = createdUser;

      // ? ACT
      const returnedValue = await service.createOne(dto);

      // ? ASSERT
      expect(spiedBcryptGenSalt).toHaveBeenCalledTimes(1);
      expect(spiedBcryptGenSalt).toHaveBeenCalledWith(rounds);

      expect(spiedBcryptHash).toHaveBeenCalledTimes(1);
      expect(spiedBcryptHash).toHaveBeenCalledWith(
        dto.password,
        genSaltReturnedValue,
      );

      expect(userModelMock.create).toHaveBeenCalledTimes(1);
      expect(userModelMock.create).toHaveBeenCalledWith(createArgs);

      expect(returnedValue).toEqual(expectedValue);
    });
  });

  describe('findOneById', () => {
    it('should find one user by id', async () => {
      // ? ARRANGE
      const id = faker.database.mongodbObjectId();

      const user = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      userModelMock.findById.mockImplementationOnce(() => user);

      const expectedValue = user;

      // ? ACT
      const returnedValue = await service.findOneById(id);

      // ? ASSERT
      expect(userModelMock.findById).toHaveBeenCalledTimes(1);
      expect(userModelMock.findById).toHaveBeenCalledWith(id);

      expect(returnedValue).toEqual(expectedValue);
    });

    it.todo('should throw an error if not find one user with given id');
  });

  describe('updateOneById', () => {
    it('should update one user by id passing password field', async () => {
      // ? ARRANGE
      const rounds = 10;
      const id = faker.database.mongodbObjectId();
      const dto = {
        username: faker.person.firstName(),
        password: faker.internet.password(),
      };

      const spiedBcryptGenSalt = jest.spyOn(bcrypt, 'genSalt');
      const spiedBcryptHash = jest.spyOn(bcrypt, 'hash');

      const genSaltReturnedValue = faker.string.uuid();
      const hashReturnedValue = faker.string.uuid();

      spiedBcryptGenSalt.mockImplementationOnce(() => genSaltReturnedValue);
      spiedBcryptHash.mockImplementationOnce(() => hashReturnedValue);

      const updatedUser = {
        ...dto,
        password: hashReturnedValue,
      };

      userModelMock.findByIdAndUpdate.mockImplementationOnce(() => updatedUser);

      const expectedValue = updatedUser;

      // ? ACT
      const returnedValue = await service.updateOneById(id, dto);

      // ? ASSERT
      expect(spiedBcryptGenSalt).toHaveBeenCalledTimes(1);
      expect(spiedBcryptGenSalt).toHaveBeenCalledWith(rounds);

      expect(spiedBcryptHash).toHaveBeenCalledTimes(1);
      expect(spiedBcryptHash).toHaveBeenCalledWith(
        dto.password,
        genSaltReturnedValue,
      );

      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updatedUser,
        { new: true },
      );

      expect(returnedValue).toEqual(expectedValue);
    });

    it('should update one user by id without passing password field', async () => {
      // ? ARRANGE
      const id = faker.database.mongodbObjectId();
      const dto = {
        username: faker.person.firstName(),
      };

      const spiedBcryptGenSalt = jest.spyOn(bcrypt, 'genSalt');
      const spiedBcryptHash = jest.spyOn(bcrypt, 'hash');

      const updatedUser = {
        ...dto,
      };

      userModelMock.findByIdAndUpdate.mockImplementationOnce(() => updatedUser);

      const expectedValue = updatedUser;

      // ? ACT
      const returnedValue = await service.updateOneById(id, dto);

      // ? ASSERT
      expect(spiedBcryptGenSalt).toHaveBeenCalledTimes(0);

      expect(spiedBcryptHash).toHaveBeenCalledTimes(0);

      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updatedUser,
        { new: true },
      );

      expect(returnedValue).toEqual(expectedValue);
    });
  });

  describe('softDeleteById', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(createToday(new Date()));
    });

    it('should soft delete one user by id', async () => {
      // ? ARRANGE
      const id = faker.database.mongodbObjectId();
      const dto = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
      };
      const updatedUser = {
        ...dto,
        deletedAt: new Date(),
      };
      userModelMock.findByIdAndUpdate.mockImplementationOnce(() => updatedUser);
      const expectedValue = updatedUser;

      // ? ACT
      const returnedValue = await service.softDeleteById(id);

      // ? ASSERT
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { deletedAt: new Date() },
        { new: true },
      );

      expect(returnedValue).toEqual(expectedValue);
    });

    afterEach(() => {
      jest.useRealTimers();
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should get all users with pagination', async () => {
      // ? ARRANGE
      const user: User = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const size = faker.number.int({ min: 5 });
      const page = faker.number.int({ min: 1 });
      const sort: SortUserDTO = {};
      const filter: FindUserDTO = {};
      const pagination: PaginationOptionsDTO = {
        page,
        size,
      };

      const query: FilterQuery<User> = {};
      const options: QueryOptions<User> = {
        limit: size,
        skip: (page - 1) * size,
        sort,
      };

      const total = faker.number.int({ min: 0 });
      const data = [user, user, user];

      const meta = new PaginationMetaDTO({ page, size, total });
      const expectedValue = new PaginationDTO(data, meta);

      userModelMock.countDocuments.mockReturnValueOnce(total);

      userModelMock.find.mockReturnValueOnce(data);

      // ? ACT
      const result = await service.findAll({ filter, pagination, sort });

      // ? ASSERT
      expect(userModelMock.countDocuments).toHaveBeenCalledTimes(1);
      expect(userModelMock.countDocuments).toHaveBeenCalledWith(query);

      expect(userModelMock.find).toHaveBeenCalledTimes(1);
      expect(userModelMock.find).toHaveBeenCalledWith(
        query,
        { password: 0 },
        options,
      );

      expect(result).toEqual(expectedValue);
    });

    it('should get all users with filter', async () => {
      // ? ARRANGE
      const user: User = {
        email: faker.internet.email(),
        username: faker.person.firstName(),
        password: faker.internet.password(),
      };

      const size = faker.number.int({ min: 5 });
      const page = faker.number.int({ min: 1 });

      const sort: SortUserDTO = {};
      const filter: FindUserDTO = {
        username: user.username,
        email: user.email,
      };
      const pagination: PaginationOptionsDTO = {
        page,
        size,
      };

      const query: FilterQuery<User> = {};
      query.username = new RegExp(`${filter.username}`, 'gi');
      query.email = new RegExp(`${filter.email}`, 'gi');

      const options: QueryOptions<User> = {
        limit: size,
        skip: (page - 1) * size,
        sort,
      };

      const total = faker.number.int({ min: 0 });
      const data = [user, user, user];

      const meta = new PaginationMetaDTO({ page, size, total });
      const expectedValue = new PaginationDTO(data, meta);

      userModelMock.countDocuments.mockReturnValueOnce(total);

      userModelMock.find.mockReturnValueOnce(data);

      // ? ACT
      const result = await service.findAll({ filter, pagination, sort });

      // ? ASSERT
      expect(userModelMock.countDocuments).toHaveBeenCalledTimes(1);
      expect(userModelMock.countDocuments).toHaveBeenCalledWith(query);

      expect(userModelMock.find).toHaveBeenCalledTimes(1);
      expect(userModelMock.find).toHaveBeenCalledWith(
        query,
        { password: 0 },
        options,
      );

      expect(result).toEqual(expectedValue);
    });

    it('should get all users with sorting', async () => {
      // ? ARRANGE
      const user: User = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const filter: FindUserDTO = {};

      const page = faker.number.int({ min: 0 });
      const size = faker.number.int({ min: 5 });
      const sort: SortUserDTO = {
        username: faker.number.int({ min: -1, max: 1 }),
        createdAt: faker.number.int({ min: -1, max: 1 }),
      };

      const pagination: PaginationOptionsDTO = {
        page,
        size,
      };

      const query: FilterQuery<User> = {};
      const options: QueryOptions<User> = {
        limit: size,
        skip: (page - 1) * size,
        sort,
      };

      const data = [user, user, user];
      const total = faker.number.int({ min: 0 });

      const meta = new PaginationMetaDTO({ page, size, total });
      const expectedValue = new PaginationDTO(data, meta);

      userModelMock.countDocuments.mockReturnValueOnce(total);

      userModelMock.find.mockReturnValueOnce(data);

      // ? ACT
      const result = await service.findAll({ filter, pagination, sort });

      // ? ASSERT
      expect(userModelMock.countDocuments).toHaveBeenCalledTimes(1);
      expect(userModelMock.countDocuments).toHaveBeenCalledWith(query);

      expect(userModelMock.find).toHaveBeenCalledTimes(1);
      expect(userModelMock.find).toHaveBeenCalledWith(
        query,
        { password: 0 },
        options,
      );

      expect(result).toEqual(expectedValue);
    });
  });
});
