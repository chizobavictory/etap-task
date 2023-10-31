import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { WalletRepository } from './wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletRepository])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
