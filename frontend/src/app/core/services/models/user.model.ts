export enum UserRole {
  FORMATEUR = 'formateur',
  APPRENANT = 'apprenant',
}

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: UserRole;
  is_active?: boolean;
  created_at?: string;
  cgu_accepted_at?: string;
  promoId?: number;
}
