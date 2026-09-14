import { env } from '../config/env.js';

import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../dto/auth.dto.js';

import jwt from 'jsonwebtoken';

// ==============================
// ACCESS TOKEN
// ==============================

// Short-lived token used to authenticate normal API requests.
export function generateAccessToken(payload: AccessTokenPayload): string {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
  });

  return token;
}

// Verifies signature and expiration to check if the token valid ,then returns the token payload.
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

// ==============================
// REFRESH TOKEN
// ==============================

// create refreshToken which is  used to generate a new access token.
export function generateRefreshToken(payload: RefreshTokenPayload) {
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET);

  return refreshToken;
}

// Verifies the refresh token before allowing a new access token to be created.
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}