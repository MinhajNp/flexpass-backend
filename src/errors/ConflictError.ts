import { HttpStatus } from '../enums/HttpStatus.js';
import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, message);
  }
}
