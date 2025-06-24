import { Person } from './person.model';
import { User } from './user.model';

export interface Promo {
  id: number;
  nom: string;
  imageUrl?: string;     // correspond à imageUrl (OK ✅)
  formateur?: User;      // correspond à user_id (OK ✅ )
  people?: Person[];     // correspond à toutes les personnes qui ont promo_id = cette promo
  members?: Person[];
}
