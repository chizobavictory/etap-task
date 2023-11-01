import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWalletForUser({
    user,
    currency,
    initialBalance,
    accountNumber,
    bankCode,
  }: {
    user: User;
    currency: string;
    initialBalance: number;
    accountNumber: string;
    bankCode: string;
  }) {
    console.log('in the createWalletForUser');
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
    console.log('in the else');

    const transferCode = await this.createTransferRecipient(
      bankCode,
      user.fullName,
      accountNumber,
    );

    console.log('user: ', user);

    const data = this.walletRepository.create({
      user,
      currency,
      balance: initialBalance,
      accountNumber,
      bankCode,
      paystackRecipientCode: transferCode,
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

    const res = await this.paystackTransfer(
      amount,
      wallet.paystackRecipientCode,
    );

    console.log('res: ', res);

    wallet.balance += amount;

    return this.walletRepository.save(wallet);
  }

  async transferFunds(
    senderWalletId: number,
    receiverWalletId: number,
    amount: number,
    adminUser: User,
    paystackRecipientCode: string,
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
      throw new BadRequestException('Large transfers require admin approval.');
    }

    if (senderWallet.balance >= amount) {
      senderWallet.balance -= amount;

      // Paystack transfer logic goes here
      const response = await this.paystackTransfer(
        amount,
        paystackRecipientCode,
      );

      if (!response.status) {
        throw new BadRequestException(response.message);
      }

      receiverWallet.balance += amount;
      await this.walletRepository.save([senderWallet, receiverWallet]); // Save the changes
      return [senderWallet, receiverWallet];
    } else {
      throw new BadRequestException(
        "Insufficient funds in the sender's wallet.",
      );
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

  async paystackTransfer(amount: number, recipient: string) {
    // Paystack transfer logic using axios
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    };

    const data = {
      source: 'balance',
      amount: amount * 100,
      recipient: recipient,
    };

    const response = await axios.post(
      'https://api.paystack.co/transfer',
      data,
      { headers },
    );

    return response.data;
  }

  async createTransferRecipient(
    bankCode: string,
    fullName: string,
    account_number: string,
  ): Promise<string> {
    // Create a transfer recipient using the Paystack transfer recipient API
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    const data = {
      type: 'nuban',
      name: fullName,
      account_number,
      bank_code: bankCode,
    };

    const response = await axios.post(
      'https://api.paystack.co/transferrecipient',
      data,
      { headers },
    );

    return response.data.data?.recipient_code ?? null;
  }
}
