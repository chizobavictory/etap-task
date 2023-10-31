import { IsNumber, IsPositive } from 'class-validator';

export class UpdateWalletDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
