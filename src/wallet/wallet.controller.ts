import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { UserAuthGuard } from 'src/user-auth/user-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(UserAuthGuard) // Protect this route for authenticated users
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWalletForUser(createWalletDto);
  }

  @Get(':id')
  @UseGuards(UserAuthGuard) // Protect this route for authenticated users
  findOne(@Param('id') id: string) {
    return this.walletService.findWalletById(+id);
  }

  @Patch('credit/:id')
  @UseGuards(UserAuthGuard) // Protect this route for authenticated users
  creditWallet(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.creditWallet(+id, updateWalletDto.amount);
  }

  @Patch('transfer/:senderId/:receiverId')
  @UseGuards(UserAuthGuard) // Protect this route for authenticated users
  transferFunds(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.transferFunds(
      +senderId,
      +receiverId,
      updateWalletDto.amount,
    );
  }

  @Get('approve-transfer/:senderId/:amount')
  @UseGuards(AdminAuthGuard) // Protect this route for admin users
  approveLargeTransfer(
    @Param('senderId') senderId: string,
    @Param('amount') amount: string,
  ) {
    return this.walletService.approveLargeTransfer(+senderId, +amount);
  }

  @Get('monthly-payment-summaries')
  @UseGuards(AdminAuthGuard) // Protect this route for admin users
  generateMonthlyPaymentSummaries() {
    return this.walletService.generateMonthlyPaymentSummaries();
  }
}
