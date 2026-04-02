export interface UserResponseDTO {
  id: string
  name: string
  email: string
  role: string
  status:string
  active_membership?: {
    plan: string;
    expiryDate: Date;
  };
  check_in_count: number;
}