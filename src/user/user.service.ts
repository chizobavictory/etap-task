// user.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: any): Promise<User> {
    // Check if a user with the same phone number already exists
    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber: user.phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const newUser = this.userRepository.create({
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async authenticateUser(
    phoneNumber: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      return null; // User not found
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return user; // Authentication successful
    }

    return null; // Incorrect password
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
