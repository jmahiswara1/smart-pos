import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};

const mockJwtService = {
    sign: jest.fn(() => 'mock-token'),
};

describe('AuthService', () => {
    let service: AuthService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return access_token for valid credentials', async () => {
            const loginDto = { email: 'test@example.com', password: 'password' };
            const user = {
                id: '1',
                email: 'test@example.com',
                passwordHash: 'hashed-password',
                role: 'admin',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.login(loginDto);

            expect(result.access_token).toEqual('mock-token');
            expect(prisma.user.update).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException for invalid email', async () => {
            const loginDto = { email: 'wrong@example.com', password: 'password' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for invalid password', async () => {
            const loginDto = { email: 'test@example.com', password: 'wrong' };
            const user = {
                id: '1',
                email: 'test@example.com',
                passwordHash: 'hashed-password',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should create a new user and return token', async () => {
            const registerDto = {
                email: 'new@example.com',
                password: 'password',
                fullName: 'New User',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // User not exists
            (prisma.user.create as jest.Mock).mockResolvedValue({
                id: '1',
                ...registerDto,
                passwordHash: 'hashed',
                role: 'admin',
            });
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

            const result = await service.register(registerDto);

            expect(prisma.user.create).toHaveBeenCalled();
            expect(result.access_token).toBeDefined();
        });

        it('should throw UnauthorizedException if email already exists', async () => {
            const registerDto = {
                email: 'exists@example.com',
                password: 'password',
                fullName: 'Existing User'
            };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

            await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
        });
    });
});
