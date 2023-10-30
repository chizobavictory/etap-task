import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createWalletForUser(
    user: User,
    currency: string,
    initialBalance: number,
  ) {
    const existingWallet = await this.walletRepository.findOne({
      where: { user, currency },
    });

    if (existingWallet) {
      throw new NotFoundException(
        `A wallet with currency ${currency} already exists for this user.`,
      );
    }

    return this.walletRepository.createWalletForUser(
      user,
      currency,
      initialBalance,
    );
  }

  async creditWallet(id: number, amount: number) {
    const wallet = await this.walletRepository.findOne(id);

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    return this.walletRepository.creditWallet(wallet, amount);
  }

  async transferFunds(
    senderWalletId: number,
    receiverWalletId: number,
    amount: number,
    adminUser: User,
  ) {
    const senderWallet = await this.walletRepository.findOne(senderWalletId);
    const receiverWallet =
      await this.walletRepository.findOne(receiverWalletId);

    if (!senderWallet || !receiverWallet) {
      throw new NotFoundException('Sender or receiver wallet not found.');
    }

    if (
      amount > 1000000 &&
      !this.walletRepository.approveLargeTransfer(
        senderWallet,
        amount,
        adminUser,
      )
    ) {
      throw new Error('Large transfers require admin approval.');
    }

    return this.walletRepository.transferFunds(
      senderWallet,
      receiverWallet,
      amount,
    );
  }

  async generateMonthlyPaymentSummaries(adminUser: User) {
    if (!adminUser.isAdmin) {
      throw new Error('Only admin users can generate payment summaries.');
    }

    return this.walletRepository.generateMonthlyPaymentSummaries();
  }
}
