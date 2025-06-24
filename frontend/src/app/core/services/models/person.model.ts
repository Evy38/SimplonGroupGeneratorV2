export interface Person {
  id: number; 
  nom: string;
  email?: string; 
  genre: 'masculin' | 'feminin' | 'nsp' | '';
  aisanceFrancais: number; // 1-4
  ancienDWWM: boolean;
  niveauTechnique: number; // 1-4
  profil: 'timide' | 'reserve' | 'alaise' | '';
  age: number | null;
}