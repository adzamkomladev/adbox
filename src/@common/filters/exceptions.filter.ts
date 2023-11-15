import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Observable, of } from 'rxjs';

import { BaseResponseDto } from '../dto/base.response.dto';

@Catch()
export class ExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<BaseResponseDto<any>> {
    const { response = {}, status } = exception;
    const { message } = response;

    const exceptionResponse = {
      status: status ?? 500,
      success: false,
      message:
        typeof message === 'string'
          ? message?.toLowerCase()
          : message?.[0]?.toLowerCase() ?? 'error occurred',
    };

    return of(exceptionResponse);
  }
}
