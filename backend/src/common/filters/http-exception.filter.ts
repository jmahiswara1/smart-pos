import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        let errors: any = null;

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                message = (exceptionResponse as any).message;
                errors = (exceptionResponse as any).errors || null;
            }
        }

        response.status(status).json({
            statusCode: status,
            message: Array.isArray(message) ? message : [message],
            errors,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
