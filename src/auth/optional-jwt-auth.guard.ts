
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // No error is thrown if no user is found
    // If there is an error (like invalid token), we can decide to ignore it or throw
    // For "optional", we usually return user if present, or null if not.
    if (err || !user) {
      return null;
    }
    return user;
  }
}
