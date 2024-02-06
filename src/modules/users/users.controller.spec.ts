import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { PaginationOptionsDTO } from '@/shared/dtos';

import { CreateUserDTO, FindUserDTO, SortUserDTO } from './dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe(UsersController.name, () => {
  let controller: UsersController;
  const usersServiceMock = {
    updateOneById: jest.fn(),
    createOne: jest.fn(),
    softDeleteById: jest.fn(),
    findAll: jest.fn(),
  };

  const mockedProviders: Provider[] = [
    {
      provide: UsersService,
      useValue: usersServiceMock,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [...mockedProviders],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('createOne', () => {
    it('should create one user', async () => {
      // ? ARRANGE
      const dto = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as CreateUserDTO;

      // ? ACT
      await controller.createOne(dto);

      // ? ASSERT
      expect(usersServiceMock.createOne).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.createOne).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateOneById', () => {
    it('should update one user by id', async () => {
      // ? ARRANGE
      const id = faker.database.mongodbObjectId();
      const dto = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      // ? ACT
      await controller.updateOneById(id, dto);

      // ? ASSERT
      expect(usersServiceMock.updateOneById).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.updateOneById).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('softDeleteById', () => {
    it('should make softDelete one user by id', async () => {
      // ? ARRANGE
      const id = faker.database.mongodbObjectId();

      // ? ACT
      await controller.softDeleteById(id);

      // ? ASSERT
      expect(usersServiceMock.softDeleteById).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.softDeleteById).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should get all users', async () => {
      // ? ARRANGE
      const pagination: PaginationOptionsDTO = {
        page: 1,
        size: 10,
      };
      const filter: FindUserDTO = {};
      const sort: SortUserDTO = {};

      // ? ACT
      await controller.findAll(pagination, filter, sort);

      // ? ASSERT
      expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findAll).toHaveBeenCalledWith({
        pagination,
        filter,
        sort,
      });
    });

    it('should get all users with filter', async () => {
      // ? ARRANGE
      const pagination: PaginationOptionsDTO = {
        page: 1,
        size: 10,
      };
      const filter: FindUserDTO = {
        username: faker.person.firstName(),
        email: faker.internet.email(),
      };
      const sort: SortUserDTO = {};

      // ? ACT
      await controller.findAll(pagination, filter, sort);

      // ? ASSERT
      expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findAll).toHaveBeenCalledWith({
        pagination,
        filter,
        sort,
      });
    });

    it('should get all users with sorting', async () => {
      // ? ARRANGE
      const pagination: PaginationOptionsDTO = {
        page: 1,
        size: 10,
      };
      const filter: FindUserDTO = {};
      const sort: SortUserDTO = {
        username: faker.number.int({ min: -1, max: 1 }),
        createdAt: faker.number.int({ min: -1, max: 1 }),
      };

      // ? ACT
      await controller.findAll(pagination, filter, sort);

      // ? ASSERT
      expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findAll).toHaveBeenCalledWith({
        pagination,
        filter,
        sort,
      });
    });
  });
});
