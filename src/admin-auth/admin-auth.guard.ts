import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Assuming you have implemented authentication middleware that attaches the user to the request.

    if (!user || !user.isAdmin) {
      return false; // User is not authenticated or not an admin.
    }

    return true; // User is authenticated and is an admin.
  }
}
