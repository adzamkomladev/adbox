import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';

import { Observable, of } from 'rxjs';

import { BaseResponseDto } from '../dto/base.response.dto';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter<any, any, any>) { }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { response = {} } = exception;
    const { message } = response;

    const exceptionResponse = {
      status: httpStatus ?? 500,
      success: false,
      message:
        typeof message === 'string'
          ? message?.toLowerCase()
          : message?.[0]?.toLowerCase() ?? 'error occurred',
    };

    this.httpAdapter.reply(ctx.getResponse(), exceptionResponse, httpStatus);

  }
}
