import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './models/User';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Service()
export class UserService {
  private users: User[] = [
    {
      id: uuidv4(),
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /**
   * Get all users
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Get a user by ID
   */
  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  /**
   * Get a user by email
   */
  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  /**
   * Create a new user
   */
  create(dto: CreateUserDto): User {
    // Check if user already exists
    const existingUser = this.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      email: dto.email,
      name: dto.name,
      role: dto.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Update an existing user
   */
  update(id: string, dto: UpdateUserDto): User {
    const user = this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check email uniqueness if email is being updated
    if (dto.email && dto.email !== user.email) {
      const existingUser = this.findByEmail(dto.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    // Update user properties
    Object.assign(user, {
      ...dto,
      updatedAt: new Date(),
    });

    return user;
  }

  /**
   * Delete a user
   */
  delete(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
  }

  /**
   * Get users by role
   */
  findByRole(role: UserRole): User[] {
    return this.users.filter((user) => user.role === role);
  }

  /**
   * Get active users
   */
  findActive(): User[] {
    return this.users.filter((user) => user.isActive);
  }
}
