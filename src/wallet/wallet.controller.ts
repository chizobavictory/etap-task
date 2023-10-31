import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AdminAuthGuard } from 'src/admin-auth/admin-auth.guard';
import { CreateWalletDto } from 'src/dto/create-wallet-dto';
import { UpdateWalletDto } from 'src/dto/update-wallet.dto';
import { UserAuthGuard } from 'src/user-auth/user-auth.guard';
import { User } from 'src/user/user.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(UserAuthGuard) // Protect this route for authenticated users
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWalletForUser(
      createWalletDto.user,
      createWalletDto.currency,
      createWalletDto.initialBalance,
    );
  }
  @Put('transfer/:senderId/:receiverId')
  @UseGuards(UserAuthGuard) // Protect this route for authenticated users
  transferFunds(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @Body() adminUser: User,
  ) {
    return this.walletService.transferFunds(
      +senderId,
      +receiverId,
      updateWalletDto.amount,
      adminUser,
  
    );
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
    return this.walletService.creditWallet(+id, +updateWalletDto.amount);
  }

  @Get('approve-transfer/:senderId/:amount')
  @UseGuards(AdminAuthGuard) // Protect this route for admin users
  async approveLargeTransfer(
    @Param('senderId') senderId: string,
    @Param('amount') amount: string,
    @Body() adminUser: User,
  ) {
    const wallet = await this.walletService.findWalletById(+senderId);
    return this.walletService.approveLargeTransfer(wallet, +amount, adminUser);
  }

  @Get('monthly-payment-summaries')
  @UseGuards(AdminAuthGuard) // Protect this route for admin users
  generateMonthlyPaymentSummaries(@Body() adminUser: User) {
    if (!adminUser.isAdmin) {
      throw new Error('Only admin users can generate payment summaries.');
    }

    return this.walletService.generateMonthlyPaymentSummaries(adminUser);
  }
}
