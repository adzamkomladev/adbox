import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { BaseResponseDto } from '../dto/base.response.dto';
import { ResponseMessageKey } from '../decorators/response.message.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T> | T>{

  constructor(private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message =
      this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ??
      'success';

    return next.handle().pipe(
      map((data) => {

        return {
          status: context.switchToHttp().getResponse()?.statusCode ?? 200,
          success: true,
          message,
          data,
        };
      }),
    );
  }
}
