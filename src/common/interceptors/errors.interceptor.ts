import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(
        catchError((err) =>
          throwError(
            () =>
              new HttpException(
                err.message || 'Server error',
                Number.isInteger(err.status) ? err.status : 500,
              ),
          ),
        ),
      );
  }
}
