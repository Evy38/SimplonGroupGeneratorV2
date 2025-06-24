// src/app/core/services/models/brief.model.ts
import { Promo} from './promo.model'; // Assure-toi que Group est bien l'interface pour les sous-groupes de travail

export interface Brief {
  id: number;
  name: string;           // Utilisé comme titre du brief
  description: string;
  promoId: number;        // ID de la Promo principale à laquelle le brief est lié
  creationDate: Date;
  imageUrl?: string;
  sourceGroupId: string | number; // ID de la Promo d'où proviennent les membres pour former les groupes
  assignedGroupId?: string | number | null; // Si un brief entier est assigné à UN groupe spécifique (moins courant pour les sous-groupes)
  groups?: Promo[];        // Tableau des sous-groupes de travail générés pour CE brief
}