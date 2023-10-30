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

  async createUser(phoneNumber: string, password: string): Promise<User> {
    // Check if a user with the same phone number already exists
    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      phoneNumber,
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
}
