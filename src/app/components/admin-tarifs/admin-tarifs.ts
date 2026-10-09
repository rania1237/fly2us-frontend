import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VisaTarifService, VisaTarif } from '../../services/visa-tarif.service';

@Component({
    selector: 'app-admin-tarifs',
    standalone: false,
    templateUrl: './admin-tarifs.html',
    styleUrls: ['./admin-tarifs.css']
})
export class AdminTarifs implements OnInit {

    // Matrice 3x3 : [visaType][priority]
    tarifsMatrix: { [key: string]: { [key: string]: VisaTarif } } = {};
    
    visaTypes = ['ETUDIANT', 'TOURISTIQUE', 'SCHENGEN'];
    priorities = ['NORMAL', 'URGENT', 'EXPRESS'];

    loading: boolean = false;
    saving: boolean = false;
    message: string = '';
    errorMessage: string = '';

    constructor(
        private service: VisaTarifService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.initMatrix();
        this.loadTarifs();
    }

    initMatrix(): void {
        this.visaTypes.forEach(type => {
            this.tarifsMatrix[type] = {};
            this.priorities.forEach(priority => {
                this.tarifsMatrix[type][priority] = {
                    visaType: type,
                    priority: priority,
                    serviceFee: 0,
                    tlsFee: 0,
                    currency: 'TND',
                    active: true
                };
            });
        });
    }

    loadTarifs(): void {
        this.loading = true;
        this.service.getAll().subscribe({
            next: (data: VisaTarif[]) => {
                // Remplir la matrice avec les données existantes
                data.forEach(tarif => {
                    if (this.tarifsMatrix[tarif.visaType] && 
                        this.tarifsMatrix[tarif.visaType][tarif.priority]) {
                        this.tarifsMatrix[tarif.visaType][tarif.priority] = tarif;
                    }
                });
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error(err);
                this.errorMessage = 'Erreur de chargement';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ✅ Sauvegarder toute la grille d'un coup
    saveAll(): void {
        this.saving = true;
        this.message = '';
        this.errorMessage = '';
        this.cdr.detectChanges();

        const allTarifs: VisaTarif[] = [];
        this.visaTypes.forEach(type => {
            this.priorities.forEach(priority => {
                const tarif = this.tarifsMatrix[type][priority];
                if (tarif.serviceFee > 0) {
                    allTarifs.push(tarif);
                }
            });
        });

        this.service.saveAll(allTarifs).subscribe({
            next: () => {
                this.message = '✅ Tous les tarifs ont été enregistrés avec succès';
                this.saving = false;
                this.loadTarifs();
            },
            error: (err: any) => {
                console.error(err);
                this.errorMessage = '❌ Erreur lors de l\'enregistrement';
                this.saving = false;
                this.cdr.detectChanges();
            }
        });
    }

    // Calculer le total d'une cellule
    getTotal(tarif: VisaTarif): number {
        return (tarif.serviceFee || 0) + (tarif.tlsFee || 0);
    }

    // Afficher un tarif
    getTarif(type: string, priority: string): VisaTarif {
        return this.tarifsMatrix[type][priority];
    }
}