import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundError,
  BadRequestError,
  QueryParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserService } from './UserService';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { User, UserRole } from './models/User';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @OpenAPI({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
    responses: {
      '200': {
        description: 'List of users',
      },
    },
  })
  async getAll(@QueryParam('role') role?: UserRole): Promise<User[]> {
    if (role) {
      return this.userService.findByRole(role);
    }
    return this.userService.findAll();
  }

  @Get('/active')
  @OpenAPI({
    summary: 'Get active users',
    description: 'Retrieve a list of all active users',
  })
  async getActive(): Promise<User[]> {
    return this.userService.findActive();
  }

  @Get('/:id')
  @OpenAPI({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
    responses: {
      '200': {
        description: 'User found',
      },
      '404': {
        description: 'User not found',
      },
    },
  })
  async getOne(@Param('id') id: string): Promise<User> {
    const user = this.userService.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  @Post('/')
  @HttpCode(201)
  @OpenAPI({
    summary: 'Create a new user',
    description: 'Create a new user with the provided data',
    responses: {
      '201': {
        description: 'User created successfully',
      },
      '400': {
        description: 'Invalid input data',
      },
    },
  })
  async create(@Body() dto: CreateUserDto): Promise<User> {
    try {
      return this.userService.create(dto);
    } catch (error) {
      throw new BadRequestError((error as Error).message);
    }
  }

  @Put('/:id')
  @OpenAPI({
    summary: 'Update a user',
    description: 'Update an existing user by their ID',
    responses: {
      '200': {
        description: 'User updated successfully',
      },
      '404': {
        description: 'User not found',
      },
      '400': {
        description: 'Invalid input data',
      },
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    try {
      return this.userService.update(id, dto);
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'User not found') {
        throw new NotFoundError(message);
      }
      throw new BadRequestError(message);
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({
    summary: 'Delete a user',
    description: 'Delete a user by their ID',
    responses: {
      '204': {
        description: 'User deleted successfully',
      },
      '404': {
        description: 'User not found',
      },
    },
  })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      this.userService.delete(id);
    } catch (error) {
      throw new NotFoundError((error as Error).message);
    }
  }
}
