import type { AccessTokenPayload } from '../dto/auth.dto.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
