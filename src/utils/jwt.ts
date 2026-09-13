import { env } from '../config/env.js';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../dto/auth.dto.js';
import jwt from 'jsonwebtoken';

export function generateAccessToken(payload: AccessTokenPayload): string {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
  });

  return token;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function generateRefreshToken(payload: RefreshTokenPayload) {
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET);
  return refreshToken;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
