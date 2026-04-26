import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test_secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn(() => Promise.resolve('fake_token')) },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register the user and return the token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: 'new@test.com',
        username: 'new',
      });

      const dto = {
        email: 'new@test.com',
        password: '123456',
        username: 'new',
        firstname: 'Ivan',
        lastname: 'Ivanov',
      };
      const result = await service.register(dto);

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('fake_token');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw a ConflictException if the email address is already taken', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '5.0.0' },
      );
      mockPrisma.user.create.mockRejectedValue(prismaError);

      const dto = {
        email: 'new@test.com',
        password: '123456',
        username: 'new',
        firstName: 'Ivan',
        lastname: 'Ivanov',
      };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });
});
