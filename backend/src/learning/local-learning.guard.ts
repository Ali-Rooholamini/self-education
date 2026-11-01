import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import type { Request } from 'express'

@Injectable()
export class LocalLearningGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const address = request.socket.remoteAddress ?? ''
    const host = request.hostname
    const local =
      address === '::1' ||
      address === '127.0.0.1' ||
      address === '::ffff:127.0.0.1'
    const localHost = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(host)
    const origin = request.get('origin')
    if (
      !local ||
      !localHost ||
      (origin &&
        origin !== (process.env.CORS_ORIGIN ?? 'http://localhost:3000'))
    ) {
      throw new ForbiddenException(
        'اتاق یادگیری فقط برای استفادهٔ محلی این پروژه فعال است.',
      )
    }
    return true
  }
}
