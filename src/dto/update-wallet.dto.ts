import { IsNumber, IsPositive } from 'class-validator';
import { User } from 'src/user/user.entity';

export class UpdateWalletDto {
  @IsNumber()
  @IsPositive()
  amount: number;
  adminUser: User;
}
