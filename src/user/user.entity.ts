import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];
}
