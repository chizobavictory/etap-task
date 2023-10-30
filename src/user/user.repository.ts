// user.repository.ts
import { Repository } from 'typeorm';
import { User } from './user.entity';

export class UserRepository extends Repository<User> {
  async createUser(phoneNumber: string, password: string): Promise<User> {
    const user = this.create({ phoneNumber, password });
    return this.save(user);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return this.findOne({ where: { phoneNumber } });
  }
}
