import { HttpStatus } from '../enums/HttpStatus.js';
import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(HttpStatus.FORBIDDEN, message);
  }
}
