import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Promo } from '../../../core/services/models/promo.model';
import { Person } from '../../../core/services/models/person.model';
import { PromoService } from '../../../core/services/promo.service';
import { ListService } from '../../../core/services/list.service';

@Component({
  selector: 'app-promo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css']
})
export class PromoListComponent implements OnInit, OnDestroy {
  promos: Promo[] = [];
  private promosSubscription?: Subscription;

  lists: any[] = [];

  isCreateOrEditModalOpen = false;
  isEditMode = false;
  currentPromoData!: { id?: string | number; nom: string; imageUrl?: string; members: Person[] };

  newPersonName: string = '';
  newPersonEmail: string = '';
  newPersonInput = '';
  allAvailablePeopleForSelection: Person[] = [];

  formError: string | null = null;
  formSuccess: string | null = null;

  isConfirmDeleteModalOpen = false;
  promoToDelete: Promo | null = null;

  isPromoMembersModalOpen = false;
  selectedPromoForMembers: Promo | null = null;

  constructor(
    private readonly promoService: PromoService,
    private readonly listService: ListService
  ) {}

  ngOnInit(): void {
    this.promosSubscription = this.promoService.getAllPromos().subscribe(data => {
      this.promos = data;
    });

    this.loadLists();
  }

  loadLists(): void {
    this.listService.getAllLists().subscribe({
      next: data => {
        this.lists = data;
      },
      error: err => {
        console.error('Erreur chargement listes:', err);
      }
    });
  }

  openCreatePromoModal(): void {
    this.isEditMode = false;
    this.currentPromoData = {
      nom: '',
      imageUrl: '',
      members: []
    };
    this.formError = null;
    this.formSuccess = null;
    this.newPersonInput = '';
    this.isCreateOrEditModalOpen = true;
  }

  openEditPromoModal(promoToEdit: Promo): void {
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

    if (!this.currentPromoData.nom.trim()) {
      this.formError = "Le nom de la promo est obligatoire.";
      return;
    }

    const promoPayload: Omit<Promo, 'id'> = {
      nom: this.currentPromoData.nom.trim(),
      members: this.currentPromoData.members.map(m => ({ ...m })),
      imageUrl: this.currentPromoData.imageUrl?.trim() ?? undefined,
      formateurName: 'Formateur Test' // Peut être dynamique plus tard
    };

    if (this.isEditMode && this.currentPromoData.id) {
      this.promoService.updatePromo(this.currentPromoData.id, promoPayload).subscribe(() => {
        this.refreshPromos();
        this.formSuccess = `Promo "${promoPayload.nom}" modifiée avec succès.`;
        setTimeout(() => this.closeCreateOrEditModal(), 1500);
      });
    } else {
      this.promoService.createPromo(promoPayload).subscribe(() => {
        this.refreshPromos();
        this.formSuccess = `Promo "${promoPayload.nom}" créée avec succès.`;
        setTimeout(() => this.closeCreateOrEditModal(), 1500);
      });
    }
  }

  refreshPromos(): void {
    this.promoService.getAllPromos().subscribe(data => {
      this.promos = data;
    });
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

  addPersonFromInput(): void {
    const person = this.allAvailablePeopleForSelection.find(
      p => p.nom.toLowerCase().includes(this.newPersonInput.toLowerCase()) ||
           p.email?.toLowerCase().includes(this.newPersonInput.toLowerCase())
    );

    if (person) {
      this.addPersonToCurrentPromo(person);
      this.newPersonInput = '';
    } else {
      this.formError = 'Aucune personne trouvée avec ce nom ou email';
    }
  }

  getAvailablePeopleForSelection(): Person[] {
    if (!this.currentPromoData?.members) return this.allAvailablePeopleForSelection;
    const currentIds = new Set(this.currentPromoData.members.map(m => m.id));
    return this.allAvailablePeopleForSelection.filter(p => !currentIds.has(p.id));
  }

  createAndAddPerson(): void {
    if (!this.newPersonName || !this.newPersonEmail) {
      this.formError = "Nom et email requis.";
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      nom: this.newPersonName,
      email: this.newPersonEmail,
      genre: 'nsp',
      aisanceFrancais: 1,
      ancienDWWM: false,
      niveauTechnique: 1,
      profil: '',
      age: 0
    };

    this.currentPromoData.members.push(newPerson);
    this.newPersonName = '';
    this.newPersonEmail = '';
    this.formError = '';
  }

  openPromoMembersModal(promo: Promo): void {
    this.selectedPromoForMembers = promo;
    this.isPromoMembersModalOpen = true;
  }

  closePromoMembersModal(): void {
    this.isPromoMembersModalOpen = false;
    this.selectedPromoForMembers = null;
  }

  openConfirmDeletePromoModal(promo: Promo): void {
    this.promoToDelete = promo;
    this.isConfirmDeleteModalOpen = true;
  }

  closeConfirmDeletePromoModal(): void {
    this.isConfirmDeleteModalOpen = false;
    this.promoToDelete = null;
  }

  confirmDeletePromo(): void {
    if (this.promoToDelete?.id) {
      this.promoService.deletePromo(this.promoToDelete.id).subscribe(() => {
        this.refreshPromos();
        this.closeConfirmDeletePromoModal();
      });
    }
  }

  ngOnDestroy(): void {
    this.promosSubscription?.unsubscribe();
  }
}
