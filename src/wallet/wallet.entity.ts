import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, // Use ManyToOne for a single user relationship
  Unique,
} from 'typeorm';

@Entity()
@Unique(['currency', 'user']) // Define a unique constraint for currency and user combination
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  currency: string; // Unique currency for each wallet

  @Column({ default: 0 })
  balance: number; // Initial balance

  @ManyToOne(() => User, (user) => user.wallets) // Use ManyToOne for a single user relationship
  user: User;
}
