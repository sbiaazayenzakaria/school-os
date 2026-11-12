import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * AuditInterceptor: Automatically logs state-changing requests
 * to the immutable AuditLog table for GDPR compliance and forensic auditing.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip, headers } = request;

    // Only audit write operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        if (!user?.sub) return;

        const organizationId =
          request.params?.organizationId ||
          request.body?.organizationId ||
          request.headers?.['x-tenant-id'];

        if (!organizationId) return;

        const entityType = this.extractEntityType(url);
        const entityId =
          request.params?.id ||
          responseData?.id ||
          responseData?.data?.id ||
          'unknown';

        await this.prisma.auditLog.create({
          data: {
            organizationId,
            userId: user.sub,
            action: `${method}:${entityType}`,
            entityType,
            entityId: String(entityId),
            newValues: method !== 'DELETE' ? JSON.stringify(body) : undefined,
            ipAddress: ip || request.connection?.remoteAddress,
            userAgent: headers?.['user-agent'],
          },
        });
      }),
    );
  }

  private extractEntityType(url: string): string {
    const segments = url.split('/').filter(Boolean);
    // Format: /api/v1/{entityType}/...
    return segments[2] || 'unknown';
  }
}
