import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

export class WalletRepository extends Repository<Wallet> {
  async createWalletForUser(
    user: User,
    currency: string,
    initialBalance: number,
  ): Promise<Wallet> {
    const wallet = this.create({ user, currency, balance: initialBalance });
    return this.save(wallet);
  }

  async creditWallet(wallet: Wallet, amount: number): Promise<Wallet> {
    wallet.balance += amount;
    return this.save(wallet);
  }

  async transferFunds(
    senderWallet: Wallet,
    receiverWallet: Wallet,
    amount: number,
  ): Promise<[Wallet, Wallet]> {
    if (senderWallet.balance >= amount) {
      senderWallet.balance -= amount;
      receiverWallet.balance += amount;
      await this.save([senderWallet, receiverWallet]); // Save the changes
      return [senderWallet, receiverWallet];
    } else {
      throw new Error("Insufficient funds in the sender's wallet.");
    }
  }

  async approveLargeTransfer(
    senderWallet: Wallet,
    amount: number,
    adminUser: User,
  ): Promise<boolean> {
    if (amount > 1000000) {
      if (adminUser.isAdmin) {
        return true;
      }
    }
    return false;
  }

  async generateMonthlyPaymentSummaries(): Promise<any> {
    // Add logic to generate monthly payment summaries
    return {};
  }
}
