import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No specific roles required, so allow access.
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Assuming you have implemented authentication middleware that attaches the user to the request.

    if (!user) {
      return false; // User is not authenticated.
    }

    return roles.includes('user'); // Assuming 'user' is the role for regular users.
  }
}
