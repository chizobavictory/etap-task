// user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() body: { phoneNumber: string; password: string }) {
    const { phoneNumber, password } = body;
    return this.userService.createUser(phoneNumber, password);
  }

  @Post('login')
  async loginUser(@Body() body: { phoneNumber: string; password: string }) {
    const { phoneNumber, password } = body;
    const user = await this.userService.authenticateUser(phoneNumber, password);

    if (user) {
      return { message: 'Authentication successful' };
    } else {
      return { message: 'Authentication failed' };
    }
  }
}