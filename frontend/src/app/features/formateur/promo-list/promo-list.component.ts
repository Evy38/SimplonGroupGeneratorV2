import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Promo } from '../../../core/services/models/promo.model';
import { Person } from '../../../core/services/models/person.model';
import { PromoService } from '../../../core/services/promo.service';
import { PersonService } from '../../../core/services/person.service';

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

  allPeople: Person[] = [];

  isCreateOrEditModalOpen = false;
  isEditMode = false;
  currentPromoData!: { id?: string | number; nom: string; imageUrl?: string; members: Person[] };

  newPersonId: number | null = null;
  formError: string | null = null;
  formSuccess: string | null = null;

  isConfirmDeleteModalOpen = false;
  promoToDelete: Promo | null = null;

  isPromoMembersModalOpen = false;
  selectedPromoForMembers: Promo | null = null;

  constructor(
    private readonly promoService: PromoService,
    private readonly personService: PersonService
  ) {}

  ngOnInit(): void {
    this.promosSubscription = this.promoService.getAllPromos().subscribe(promos => {
      this.promos = promos;
    });

    this.personService.getAllPeopleByList(0).subscribe(people => {
      this.allPeople = people;
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
    this.newPersonId = null;
    this.isCreateOrEditModalOpen = true;
  }

  openEditPromoModal(promoToEdit: Promo): void {
    this.isEditMode = true;
    this.currentPromoData = JSON.parse(JSON.stringify(promoToEdit));
    this.formError = null;
    this.formSuccess = null;
    this.newPersonId = null;
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
      this.formError = 'Le nom de la promo est obligatoire.';
      return;
    }

    const promoPayload = {
      name: this.currentPromoData.nom.trim(),
      members: this.currentPromoData.members,
      imageUrl: this.currentPromoData.imageUrl?.trim() ?? undefined,
      formateurName: 'Formateur Test'
    };

    if (this.isEditMode && this.currentPromoData.id) {
      const promoId = typeof this.currentPromoData.id === 'string' ? parseInt(this.currentPromoData.id, 10) : this.currentPromoData.id;
      this.promoService.updatePromo(promoId, promoPayload).subscribe(() => {
        this.refreshPromos();
        this.formSuccess = `Promo "${promoPayload.name}" modifiée avec succès.`;
        setTimeout(() => this.closeCreateOrEditModal(), 1500);
      });
    } else {
      this.promoService.createPromo(promoPayload).subscribe(() => {
        this.refreshPromos();
        this.formSuccess = `Promo "${promoPayload.name}" créée avec succès.`;
        setTimeout(() => this.closeCreateOrEditModal(), 1500);
      });
    }
  }

  refreshPromos(): void {
    this.promoService.getAllPromos().subscribe(promos => {
      this.promos = promos;
    });
  }

  addPersonToCurrentPromoById(): void {
    if (!this.newPersonId) return;
    const person = this.allPeople.find(p => Number(p.id) === Number(this.newPersonId));
    if (person && !this.currentPromoData.members.find(m => m.id === person.id)) {
      this.currentPromoData.members.push(person);
    }
    this.newPersonId = null;
  }

  removePersonFromCurrentPromo(personToRemove: Person): void {
    if (this.currentPromoData) {
      this.currentPromoData.members = this.currentPromoData.members.filter(p => p.id !== personToRemove.id);
    }
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
