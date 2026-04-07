export interface ITokenPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export interface IGoogleAuthService {
  verifyToken(idToken: string): Promise<ITokenPayload>;
}
