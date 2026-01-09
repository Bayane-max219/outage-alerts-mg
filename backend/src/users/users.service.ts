import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Création d'un admin par défaut si aucun utilisateur n'existe
    const count = await this.usersRepository.count();
    if (count === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      const admin = this.usersRepository.create({
        name: 'Administrateur',
        email: 'admin@jirama.local',
        password: passwordHash,
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(admin);
      // eslint-disable-next-line no-console
      console.log('Utilisateur admin par défaut créé: admin@jirama.local / admin123');
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: passwordHash,
      role: dto.role || UserRole.AGENT,
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.password) {
      dto = { ...dto, password: await bcrypt.hash(dto.password, 10) };
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
