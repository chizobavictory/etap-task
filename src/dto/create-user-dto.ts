import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  fullName: string | null;

  @IsNotEmpty()
  @IsString()
  password: string;
}
