import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { User } from 'src/user/user.entity';

export class CreateWalletDto {
  @IsNotEmpty()
  user: User; // Assuming the user ID is used to identify the user.

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  accountNumber: string | null;

  @IsString()
  bankCode: string | null;

  @IsNumber()
  @IsPositive()
  initialBalance: number;
}
