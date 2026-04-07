export interface IGymInvitationEmailService {
  sendInvitation(email: string, token: string): Promise<void>
  sendRejection(email: string, reason: string): Promise<void>
}