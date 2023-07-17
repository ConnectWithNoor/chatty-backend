import HTTP_STATUS from 'http-status-codes';

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export interface IErrorResponse extends IError {
  serializeErrors(): IError;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode: number = HTTP_STATUS.BAD_REQUEST;
  status = 'Bad request';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode: number = HTTP_STATUS.NOT_FOUND;
  status = 'Not found';

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode: number = HTTP_STATUS.UNAUTHORIZED;
  status = 'UnAuthorized';

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode: number = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'File too large';

  constructor(message: string) {
    super(message);
  }
}

export class ServiceError extends CustomError {
  statusCode: number = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'Service is unavilable';

  constructor(message: string) {
    super(message);
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode: number = HTTP_STATUS.BAD_REQUEST;
  status = 'Validation error';

  constructor(message: string) {
    super(message);
  }
}
