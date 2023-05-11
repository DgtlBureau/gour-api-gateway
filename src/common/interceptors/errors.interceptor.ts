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
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
      console.log(err);
        if (err instanceof HttpException) {
          const arrMsg = (err.getResponse() as { message: [] })?.message;
          const isArrMessage = Array.isArray(arrMsg);
          const msg = isArrMessage ? arrMsg.join(', ') : err.message;
          return throwError(() => new HttpException(msg, err.getStatus()));
        }

        return throwError(
          () =>
            new HttpException(
              err?.message || 'Произошла ошибка',
              +err?.status || 500,
            ),
        );
      }),
    );
  }
}
