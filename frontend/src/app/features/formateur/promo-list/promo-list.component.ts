// src/app/features/formateur/promo-list/promo-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Pour routerLink si besoin
import { FormsModule } from '@angular/forms';   // Pour [(ngModel)]
import { Subscription } from 'rxjs';

import { Group } from '../../../core/services/models/group.model';   
import { Person } from '../../../core/services/models/person.model';
import { PromoService } from '../../../core/services/promo.service';
import { ListService } from '../../../core/services/list.service';

const ALL_SYSTEM_PEOPLE: Person[] = [
  { id: 'p1', nom: 'Alice Lemaire (Poney/Chaton)', email: 'alice@mail.com', genre: 'feminin', aisanceFrancais: 4, ancienDWWM: true, niveauTechnique: 3, profil: 'alaise', age: 28 },
  { id: 'p2', nom: 'Bob Martin (Poney)', email: 'bob@mail.com', genre: 'masculin', aisanceFrancais: 3, ancienDWWM: false, niveauTechnique: 2, profil: 'reserve', age: 22 },
  { id: 'p3', nom: 'Charlie Durand (Marmotte)', email: 'charlie@mail.com', genre: 'nsp', aisanceFrancais: 4, ancienDWWM: true, niveauTechnique: 4, profil: 'timide', age: 30 },
  { id: 'p4', nom: 'Diana Pires (Marmotte/Chaton)', email: 'diana@mail.com', genre: 'feminin', aisanceFrancais: 2, ancienDWWM: false, niveauTechnique: 1, profil: 'alaise', age: 25 },
  { id: 'p5', nom: 'Émile Petit (Marmotte)', email: 'emile@mail.com', genre: 'masculin', aisanceFrancais: 3, ancienDWWM: true, niveauTechnique: 2, profil: 'reserve', age: 27 },
  { id: 'p6', nom: 'Fiona Guyot (Poney/Chaton)', email: 'fiona@mail.com', genre: 'feminin', aisanceFrancais: 4, ancienDWWM: false, niveauTechnique: 3, profil: 'alaise', age: 24 },
  { id: 'p7', nom: 'Gaspard Roux', email: 'gaspard@mail.com', genre: 'masculin', aisanceFrancais: 2, ancienDWWM: false, niveauTechnique: 1, profil: 'timide', age: 29 },
  { id: 'p8', nom: 'Hélène Claire', email: 'helene@mail.com', genre: 'feminin', aisanceFrancais: 3, ancienDWWM: true, niveauTechnique: 3, profil: 'reserve', age: 26 },
  {
    id: 'p-apprenant-test',
    nom: 'Apprenant Test User',
    email: 'apprenant@test.com',
    genre: 'nsp',
    aisanceFrancais: 3,
    ancienDWWM: false,
    niveauTechnique: 2,
    profil: 'reserve',
    age: 25
  }
];

@Component({
  selector: 'app-promo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css']
})
export class PromoListComponent implements OnInit, OnDestroy {
  promos: Group[] = [];
  private promosSubscription?: Subscription;

  lists: any[] = []; // Pour stocker les listes récupérées du backend

  isCreateOrEditModalOpen = false;
  isEditMode = false;
  currentPromoData!: { id?: string | number; name: string; imageUrl?: string; members: Person[] };

  allAvailablePeopleForSelection: Person[] = [...ALL_SYSTEM_PEOPLE];
  newPersonInput = '';
  formError: string | null = null;
  formSuccess: string | null = null;

  isConfirmDeleteModalOpen = false;
  promoToDelete: Group | null = null;

  isPromoMembersModalOpen = false;
  selectedPromoForMembers: Group | null = null;

  newPersonName: string = '';
newPersonEmail: string = '';

  
  constructor(
    private readonly promoService: PromoService,
    private readonly listService: ListService
  ) {}

  ngOnInit(): void {
    this.promosSubscription = this.promoService.promos$.subscribe(data => {
      this.promos = data;
    });

    this.loadLists();
  }

  loadLists(): void {
    this.listService.getAllLists().subscribe({
      next: data => {
        this.lists = data;
        console.log('Listes chargées:', this.lists);
      },
      error: err => {
        console.error('Erreur chargement listes:', err);
      }
    });
  }

  openCreatePromoModal(): void {
    this.isEditMode = false;
    this.currentPromoData = {
      name: '',
      imageUrl: '',
      members: []
    };
    this.formError = null;
    this.formSuccess = null;
    this.newPersonInput = '';
    this.isCreateOrEditModalOpen = true;
  }

  openEditPromoModal(promoToEdit: Group): void {
    this.isEditMode = true;
    this.currentPromoData = JSON.parse(JSON.stringify(promoToEdit));
    this.formError = null;
    this.formSuccess = null;
    this.newPersonInput = '';
    this.isCreateOrEditModalOpen = true;
  }

  closeCreateOrEditModal(): void {
    this.isCreateOrEditModalOpen = false;
    this.isEditMode = false;
  }

  onSavePromoSubmit(): void {
    this.formError = null;
    this.formSuccess = null;

    if (!this.currentPromoData.name.trim()) {
      this.formError = "Le nom de la promo est obligatoire.";
      return;
    }

    if (this.isEditMode && this.currentPromoData.id) {
      const promoToUpdate: Group = {
        id: this.currentPromoData.id,
        name: this.currentPromoData.name.trim(),
        members: this.currentPromoData.members.map(m => ({ ...m })),
        imageUrl: this.currentPromoData.imageUrl?.trim() ?? undefined
      };
      this.promoService.updatePromo(promoToUpdate);
      this.formSuccess = `Promo "${promoToUpdate.name}" modifiée avec succès.`;
    } else {
      const newPromoPayload: Omit<Group, 'id'> = {
        name: this.currentPromoData.name.trim(),
        members: this.currentPromoData.members.map(m => ({ ...m })),
        imageUrl: this.currentPromoData.imageUrl?.trim() ?? undefined
      };
      const createdPromo = this.promoService.addPromo(newPromoPayload);
      this.formSuccess = `Promo "${createdPromo.name}" créée avec succès.`;
    }

    setTimeout(() => {
      this.closeCreateOrEditModal();
      this.formSuccess = null;
    }, 1500);
  }

  removePersonFromCurrentPromo(personToRemove: Person): void {
    if (this.currentPromoData) {
      this.currentPromoData.members = this.currentPromoData.members.filter(p => p.id !== personToRemove.id);
    }
  }

  addPersonToCurrentPromo(personToAdd: Person): void {
    if (this.currentPromoData && !this.currentPromoData.members.find(m => m.id === personToAdd.id)) {
      this.currentPromoData.members = [...this.currentPromoData.members, { ...personToAdd }];
    }
    this.newPersonInput = '';
  }

addPersonFromInput() {
  console.log("Tentative d'ajout :", this.newPersonInput);

  const person = this.getAvailablePeopleForSelection().find(
    p => p.nom.toLowerCase().includes(this.newPersonInput.toLowerCase()) ||
         p.email?.toLowerCase().includes(this.newPersonInput.toLowerCase())
  );

  if (person) {
    this.addPersonToCurrentPromo(person);
    this.newPersonInput = '';
  } else {
    console.warn("Aucune personne trouvée pour :", this.newPersonInput);
    this.formError = 'Aucune personne trouvée avec ce nom ou email';
  }
}


  getAvailablePeopleForSelection(): Person[] {
    if (!this.currentPromoData?.members) {
      return [...this.allAvailablePeopleForSelection];
    }
    const currentMemberIds = new Set(this.currentPromoData.members.map(m => m.id));
    return this.allAvailablePeopleForSelection.filter(p => !currentMemberIds.has(p.id));
  }

  openPromoMembersModal(promo: Group): void {
    this.selectedPromoForMembers = promo;
    this.isPromoMembersModalOpen = true;
  }

  closePromoMembersModal(): void {
    this.isPromoMembersModalOpen = false;
    this.selectedPromoForMembers = null;
  }

  openConfirmDeletePromoModal(promo: Group): void {
    this.promoToDelete = promo;
    this.isConfirmDeleteModalOpen = true;
  }

  closeConfirmDeletePromoModal(): void {
    this.isConfirmDeleteModalOpen = false;
    this.promoToDelete = null;
  }

  confirmDeletePromo(): void {
    if (this.promoToDelete?.id) {
      this.promoService.deletePromo(this.promoToDelete.id);
      this.closeConfirmDeletePromoModal();
    }
  }

  ngOnDestroy(): void {
    this.promosSubscription?.unsubscribe();
  }

  createAndAddPerson() {
  if (!this.newPersonName || !this.newPersonEmail) {
    this.formError = "Nom et email requis.";
    return;
  }

  const newPerson: Person = {
    id: Date.now().toString(), // 🔑 ID généré automatiquement
    nom: this.newPersonName,
    email: this.newPersonEmail,
    genre: 'nsp', // ou '' selon ton besoin
    aisanceFrancais: 1, // ou 0 si tu autorises
    ancienDWWM: false,
    niveauTechnique: 1, // ou 0
    profil: '',
    age: 0
  };

  this.currentPromoData.members.push(newPerson);

  // Réinitialise les champs
  this.newPersonName = '';
  this.newPersonEmail = '';
  this.formError = '';
}


}
