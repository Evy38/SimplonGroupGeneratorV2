// src/app/core/services/models/promo.model.ts

import { Person } from './person.model';

export interface Promo {
  id: string | number;
  nom: string;                     // nom de la promo
  formateurName?: string;         // nom du formateur (optionnel, string)
  imageUrl?: string;              // image de la promo (optionnelle)
  members?: Person[];             // liste des personnes dans la promo
}
