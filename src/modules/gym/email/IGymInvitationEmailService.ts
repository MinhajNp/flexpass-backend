export interface IGymInvitationEmailService {
  sendInvitation(email: string, token: string): Promise<void>
}