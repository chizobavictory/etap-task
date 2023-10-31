import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, // Use ManyToOne for a single user relationship
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string; // Unique currency for each wallet

  @Column({ default: 0 })
  balance: number; // Initial balance

  @Column()
  paystackRecipientCode: string;

  @Column()
  accountNumber: string;

  @Column()
  bankCode: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
