export interface UserResponseDTO {
  id: string
  name: string
  email: string
  role: string
  status:string
  active_membership?: any;
  check_in_count: number;
}