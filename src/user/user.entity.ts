import { Wallet } from 'src/wallet/wallet.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  fullName: string | null;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
