// src/app/core/services/promo.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { PromoService } from './promo.service';
import { Person } from '../../core/services/models/person.model';
import { skip } from 'rxjs/operators';
import { Promo } from './models/promo.model';

describe('PromoService', () => {
  let service: PromoService;

  const getActualInitialPromosFromService = (
    testService: PromoService
  ): Promo[] => {
    return JSON.parse(JSON.stringify(testService['promosSubject'].getValue()));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('promos$ should initially emit the list of promos the service was initialized with', (done) => {
    const actualInitialPromos = getActualInitialPromosFromService(service);

    service.promos$.subscribe((promos) => {
      expect(promos.length).toBe(actualInitialPromos.length);
      if (actualInitialPromos.length > 0) {
        expect(promos[0].id).toEqual(actualInitialPromos[0].id);
      }
      done();
    });
  });

  describe('getPromoById', () => {
    it('should return an Observable with the correct promo if ID exists', (done) => {
      const actualInitialPromos = getActualInitialPromosFromService(service);
      if (actualInitialPromos.length === 0) {
        pending('No initial promos to test getPromoById with.');
        done();
        return;
      }
      const existingPromo = actualInitialPromos[0];

      service.getPromoById(existingPromo.id).subscribe((promo) => {
        expect(promo).toBeDefined();
        expect(promo?.id).toBe(existingPromo.id);
        expect(promo?.nom).toBe(existingPromo.nom);
        done();
      });
    });

    it('should return an Observable with undefined if ID does not exist', (done) => {
      service.getPromoById('non-existent-id-123').subscribe((promo) => {
        expect(promo).toBeUndefined();
        done();
      });
    });
  });

  describe('addPromo', () => {
    it('should add a new promo and emit the updated list via promos$', (done) => {
      const initialPromos = getActualInitialPromosFromService(service);
      const initialCount = initialPromos.length;

      const newPromoData: Omit<Promo, 'id'> = {
        nom: 'Nouvelle Promo Test',
        members: [],
        date_debut: new Date().toISOString(),
        date_fin: new Date().toISOString()
      };

      service.promos$.pipe(skip(1)).subscribe((updatedPromos) => {
        expect(updatedPromos.length).toBe(initialCount + 1);
        const addedPromo = updatedPromos.find(
          (p) => p.nom === 'Nouvelle Promo Test'
        );
        expect(addedPromo).toBeDefined();
        expect(addedPromo?.id).toBeDefined();
        expect(addedPromo?.imageUrl).toBe('new_promo.png');
        done();
      });

      service.addPromo(newPromoData);
    });
  });

  describe('updatePromo', () => {
    it('should update an existing promo and emit the updated list', (done) => {
      const initialPromos = getActualInitialPromosFromService(service);
      if (initialPromos.length === 0) {
        pending('No initial promos to test updatePromo with.');
        done();
        return;
      }
      const promoToUpdateOriginal = initialPromos[0];
      const updatedName = 'Nom Mis à Jour de la Promo';
      const promoWithUpdates: Promo = {
        ...promoToUpdateOriginal,
        nom: updatedName,
        members: [
          ...(promoToUpdateOriginal.members ?? []),
          { id: 'tempMember', nom: 'Membre Temporaire' } as Person,
        ],
      };

      service.promos$.pipe(skip(1)).subscribe((updatedPromos) => {
        const updatedPromoInList = updatedPromos.find(
          (p) => p.id === promoToUpdateOriginal.id
        );
        expect(updatedPromoInList).toBeDefined();
        expect(updatedPromoInList?.nom).toBe(updatedName);
        expect(updatedPromoInList?.members.length).toBe(
          (promoToUpdateOriginal.members?.length ?? 0) + 1
        );
        done();
      });

      service.updatePromo(promoWithUpdates);
    });

    it('should not change the list if trying to update a non-existent promo', (done) => {
      const nonExistentPromo: Promo = {
        id: -999, // Utilise un nombre qui n'existe pas
        nom: 'Promo Fantôme',
        members: [],
        date_debut: new Date().toISOString(),
        date_fin: new Date().toISOString(),
      };
      const initialPromos = getActualInitialPromosFromService(service);
      const consoleWarnSpy = spyOn(console, 'warn');

      service.updatePromo(nonExistentPromo);

      const promosAfterAttemptedUpdate =
        getActualInitialPromosFromService(service);
      expect(promosAfterAttemptedUpdate.length).toBe(initialPromos.length);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(
          /Tentative de mise à jour d'une promo non trouvée/
        )
      );

      done();
    });
  });

  describe('deletePromo', () => {
    it('should delete an existing promo and emit the updated list', (done) => {
      const initialPromos = getActualInitialPromosFromService(service);
      if (initialPromos.length === 0) {
        pending('No initial promos to test deletePromo with.');
        done();
        return;
      }
      const promoToDelete = initialPromos[0];
      const initialCount = initialPromos.length;

      service.promos$.pipe(skip(1)).subscribe((updatedPromos) => {
        expect(updatedPromos.length).toBe(initialCount - 1);
        const deletedPromoInList = updatedPromos.find(
          (p) => p.id === promoToDelete.id
        );
        expect(deletedPromoInList).toBeUndefined();
        done();
      });

      service.deletePromo(promoToDelete.id);
    });

    it('should not change the list if trying to delete a non-existent promo', (done) => {
      const initialPromosCount =
        getActualInitialPromosFromService(service).length;
      const consoleWarnSpy = spyOn(console, 'warn');

      service.deletePromo('id-inexistant-pour-delete');

      const promosAfterAttempt = getActualInitialPromosFromService(service);
      expect(promosAfterAttempt.length).toBe(initialPromosCount);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(
          /Tentative de suppression d'une promo non trouvée/
        )
      );
      done();
    });
  });

  describe('addMemberToPromo', () => {
    it('should add a member to the specified promo if not already present', (done) => {
      const initialPromos = getActualInitialPromosFromService(service);
      const promo = initialPromos[0];
      const memberToAdd: Person = {
        id: 'new-member-id',
        nom: 'Nouveau Membre',
        email: 'new@mail.com',
        genre: 'nsp',
        aisanceFrancais: 3,
        ancienDWWM: false,
        niveauTechnique: 2,
        profil: 'timide',
        age: 30,
      };

      service.promos$.pipe(skip(1)).subscribe((updatedPromos) => {
        const updatedPromo = updatedPromos.find((p) => p.id === promo.id);
        expect(updatedPromo).toBeDefined();
        expect(
          updatedPromo!.members.find((m: Person) => m.id === memberToAdd.id)
        ).toBeDefined();
        done();
      });

      service.addMemberToPromo(promo.id, memberToAdd);
    });

    it('should not add a duplicate member to the promo', () => {
      const initialPromos = getActualInitialPromosFromService(service);
      const promo = initialPromos[0];
      if (!promo.members || promo.members.length === 0) {
        pending('No members in promo to test duplicate add.');
        return;
      }
      const existingMember = promo.members[0];

      const beforeCount = promo.members.filter(
        (m) => m.id === existingMember.id
      ).length;

      service.addMemberToPromo(promo.id, existingMember);

      const updatedPromos = getActualInitialPromosFromService(service);
      const updatedPromo = updatedPromos.find((p) => p.id === promo.id)!;
      const afterCount = (updatedPromo.members ?? []).filter(
        (m) => m.id === existingMember.id
      ).length;

      expect(afterCount).toBe(beforeCount);
    });
  });

  describe('removeMemberFromPromo', () => {
    it('should remove a member from the specified promo', (done) => {
      const initialPromos = getActualInitialPromosFromService(service);
      const promo = initialPromos[0];
      if (!promo.members || promo.members.length === 0) {
        pending('No members in promo to test remove.');
        done();
        return;
      }
      const memberToRemove = promo.members[0];

      service.promos$.pipe(skip(1)).subscribe((updatedPromos) => {
        const updatedPromo = updatedPromos.find((p) => p.id === promo.id);
        expect(
          updatedPromo!.members.find((m: Person) => m.id === memberToRemove.id)
        ).toBeUndefined();
        done();
      });

      service.removeMemberFromPromo(promo.id, memberToRemove.id);
    });

    it('should not throw or fail if member to remove does not exist', (done) => {
      const initialPromos = getActualInitialPromosFromService(service);
      const promo = initialPromos[0];

      service.promos$.pipe(skip(1)).subscribe((updatedPromos) => {
        const updatedPromo = updatedPromos.find((p) => p.id === promo.id);
        expect(updatedPromo!.members.length).toBe(promo.members?.length ?? 0);
        done();
      });

      service.removeMemberFromPromo(promo.id, 'id-inexistant-membre');
    });
  });
});
