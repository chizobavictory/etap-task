import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWalletForUser(
    user: User,
    currency: string,
    initialBalance: number,
  ) {
    const existingWallet = await this.walletRepository.findOne({
      where: { currency, user },
    });

    console.log('existingWallet: ', existingWallet);

    if (existingWallet) {
      console.log('in the if');
      throw new NotFoundException(
        `A wallet with currency ${currency} already exists for this user.`,
      );
    }

    const data = this.walletRepository.create({
      user,
      currency,
      balance: initialBalance,
    });

    return this.walletRepository.save(data);
  }

  async creditWallet(walletId: number, amount: number) {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    wallet.balance += amount;
    return this.walletRepository.save(wallet);
  }

  async transferFunds(
    senderWalletId: number,
    receiverWalletId: number,
    amount: number,
    adminUser: User,
  ) {
    const senderWallet = await this.walletRepository.findOne({
      where: { id: senderWalletId },
    });
    const receiverWallet = await this.walletRepository.findOne({
      where: { id: receiverWalletId },
    });

    if (!senderWallet || !receiverWallet) {
      throw new NotFoundException('Sender or receiver wallet not found.');
    }

    if (amount > 1000000) {
      if (adminUser.isAdmin) {
        return true;
      }
    }
    const status = false;

    if (amount > 1000000 && !status) {
      throw new Error('Large transfers require admin approval.');
    }

    return this.transferFundsData(senderWallet, receiverWallet, amount);
  }

  async transferFundsData(
    senderWallet: Wallet,
    receiverWallet: Wallet,
    amount: number,
  ): Promise<[Wallet, Wallet]> {
    if (senderWallet.balance >= amount) {
      senderWallet.balance -= amount;
      receiverWallet.balance += amount;
      await this.walletRepository.save([senderWallet, receiverWallet]); // Save the changes
      return [senderWallet, receiverWallet];
    } else {
      throw new Error("Insufficient funds in the sender's wallet.");
    }
  }

  async generateMonthlyPaymentSummaries(adminUser: User) {
    if (!adminUser.isAdmin) {
      throw new Error('Only admin users can generate payment summaries.');
    }

    return null;
  }

  async findWalletById(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { id: id } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    return wallet;
  }

  async approveLargeTransfer(
    senderWallet: Wallet, // Use senderWallet here
    amount: number,
    adminUser: User,
  ): Promise<boolean> {
    if (amount > 1000000) {
      if (adminUser.isAdmin) {
        // You can perform additional logic here if needed
        return true;
      }
    }
    return false;
  }
}
