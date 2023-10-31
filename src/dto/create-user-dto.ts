import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;
}
