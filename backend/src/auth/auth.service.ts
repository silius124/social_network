import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './DTO/register.dto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './DTO/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'User with this email or username already exists.',
        );
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
