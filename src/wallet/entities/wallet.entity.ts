// wallet.entity.ts
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity()
@Index('unique_currency', ['user', 'currency'], { unique: true })
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string; // Unique currency for each wallet

  @Column({ default: 0 })
  balance: number; // Initial balance

  @ManyToOne(() => User, (user) => user.wallets)
  user: User; // Many wallets belong to one user
}
