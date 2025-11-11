# Express TypeScript OpenAPI Boilerplate

> A production-ready Express.js boilerplate with TypeScript, TypeDI, routing-controllers, class-validator, OpenAPI documentation, and auto-generated client SDK using Kubb.

## 🚀 Features

- **TypeScript**: Full type safety with strict mode enabled
- **Dependency Injection**: Clean architecture with TypeDI
- **Declarative Routing**: Type-safe routing with routing-controllers decorators
- **Validation**: Automatic request validation with class-validator
- **OpenAPI/Swagger**: Auto-generated API documentation from code
- **Client SDK Generation**: Type-safe client SDK with Kubb (TypeScript types, Zod schemas, React Query hooks)
- **Error Handling**: Centralized error handling middleware
- **CORS**: Configured and ready to use
- **Hot Reload**: Development server with nodemon
- **Code Quality**: ESLint and Prettier configured
- **Real-world Example**: Complete CRUD operations for Users and Products

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm or yarn or pnpm

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [<repository-url>](https://github.com/fishuke/express-typescript-boilerplate.git)
cd express-typescript-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The API will be available at:
- **API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api-docs
- **OpenAPI Spec**: http://localhost:3000/api/openapi.json
- **Health Check**: http://localhost:3000/health

## 📁 Project Structure

```
express-typescript-openapi-boilerplate/
├── src/
│   ├── controllers/        # API controllers with routing-controllers
│   │   ├── UserController.ts
│   │   └── ProductController.ts
│   ├── services/           # Business logic with TypeDI
│   │   ├── UserService.ts
│   │   └── ProductService.ts
│   ├── models/             # Data models and interfaces
│   │   ├── User.ts
│   │   └── Product.ts
│   ├── dto/                # Data Transfer Objects with validation
│   │   ├── CreateUserDto.ts
│   │   ├── UpdateUserDto.ts
│   │   ├── CreateProductDto.ts
│   │   └── UpdateProductDto.ts
│   ├── middleware/         # Express middleware
│   │   └── errorHandler.ts
│   ├── utils/              # Utility functions
│   │   └── generateOpenApiSpec.ts
│   └── app.ts              # Application entry point
├── client-sdk/             # Auto-generated client SDK (via Kubb)
│   ├── types/              # TypeScript types
│   ├── zod/                # Zod validation schemas
│   ├── client/             # HTTP client functions
│   └── hooks/              # React Query hooks
├── openapi/
│   └── spec.json           # Generated OpenAPI specification
├── kubb.config.ts          # Kubb configuration
├── tsconfig.json           # TypeScript configuration
├── nodemon.json            # Nodemon configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
└── package.json
```

## 🎯 API Endpoints

### Users
- `GET /api/users` - Get all users (with optional role filter)
- `GET /api/users/active` - Get active users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products (with optional category/search filters)
- `GET /api/products/available` - Get available products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update product
- `PATCH /api/products/:id/stock` - Update product stock
- `DELETE /api/products/:id` - Delete product

## 🔧 Scripts

```bash
# Development
npm run dev                 # Start dev server with hot reload

# Build
npm run build              # Compile TypeScript to JavaScript

# Production
npm start                  # Start production server

# Code Generation
npm run generate:openapi   # Generate OpenAPI specification
npm run generate:client    # Generate client SDK with Kubb
npm run generate           # Generate both OpenAPI spec and client SDK

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🎨 Tech Stack

### Backend
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type safety and better developer experience
- **TypeDI** - Dependency injection container
- **routing-controllers** - Declarative routing with decorators
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation
- **routing-controllers-openapi** - OpenAPI spec generation

### API Documentation
- **Swagger UI Express** - Interactive API documentation
- **OpenAPI 3.0** - API specification standard

### Client SDK Generation
- **Kubb** - OpenAPI to TypeScript code generator
  - TypeScript types generation
  - Zod schemas for runtime validation
  - HTTP client functions
  - TanStack Query (React Query) hooks

## 📝 Usage Examples

### Backend API Example

```typescript
// Creating a controller
@JsonController('/users')
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get all users' })
  async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('/')
  @HttpCode(201)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
```

### Generated Client SDK Example

After running `npm run generate`, you can use the generated client:

```typescript
// Using the generated client in your frontend
import { getUsers, createUser } from './client-sdk/client';

// Fetch all users
const users = await getUsers();

// Create a new user
const newUser = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user'
});
```

### Using React Query Hooks (Generated by Kubb)

```typescript
import { useGetUsers, useCreateUser } from './client-sdk/hooks';

function UsersComponent() {
  // Auto-generated React Query hook with TypeScript types
  const { data: users, isLoading } = useGetUsers();

  const createMutation = useCreateUser();

  const handleCreateUser = () => {
    createMutation.mutate({
      email: 'new@example.com',
      name: 'New User',
      role: 'user'
    });
  };

  return (
    <div>
      {isLoading ? 'Loading...' : users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={handleCreateUser}>Create User</button>
    </div>
  );
}
```

## 🔐 Validation Example

```typescript
export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole;
}
```

## 🚢 Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Docker (optional):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

## 🧪 Testing

This boilerplate is ready for testing. You can add:
- **Unit tests** with Jest
- **Integration tests** with Supertest
- **E2E tests** with your preferred framework

## 📚 Learn More

- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [TypeDI](https://github.com/typestack/typedi)
- [routing-controllers](https://github.com/typestack/routing-controllers)
- [class-validator](https://github.com/typestack/class-validator)
- [Kubb](https://kubb.dev/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is [MIT](LICENSE) licensed.

## 👤 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Note**: This is a boilerplate/starter project. In a real-world application, you would typically:
- Add a database (PostgreSQL, MongoDB, etc.)
- Implement authentication & authorization (JWT, OAuth)
- Add logging (Winston, Pino)
- Add testing (Jest, Supertest)
- Implement rate limiting
- Add request/response caching
- Set up CI/CD pipelines
- Add monitoring and observability
