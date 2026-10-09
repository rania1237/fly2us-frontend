import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DossierService, Dossier } from '../../../services/dossier.service';

@Component({
    selector: 'app-dossier-list',
    standalone: false,
    templateUrl: './dossier-list.component.html',
    styleUrls: ['./dossier-list.component.css']
})
export class DossierListComponent implements OnInit {
    dossiers: Dossier[] = [];
    filteredDossiers: Dossier[] = [];
    loading: boolean = true;
    selectedStatus: string = 'TOUS';
    searchText: string = '';

    statusList = ['TOUS', 'BROUILLON', 'EN_ATTENTE_VERIFICATION', 'EN_COURS', 'APPROUVE', 'REFUSE'];

    constructor(private dossierService: DossierService, public router: Router) {}

    ngOnInit(): void {
        this.loadDossiers();
    }

    loadDossiers(): void {
        this.loading = true;
        this.dossierService.getAllDossiers().subscribe({
            next: (data) => {
                this.dossiers = data;
                this.applyFilter();
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    applyFilter(): void {
        let filtered = this.dossiers;
        if (this.selectedStatus !== 'TOUS') {
            filtered = filtered.filter(d => d.status === this.selectedStatus);
        }
        if (this.searchText) {
            filtered = filtered.filter(d =>
                d.dossierNumber?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                d.country?.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
        this.filteredDossiers = filtered;
    }

    onStatusChange(event: Event): void {
        this.selectedStatus = (event.target as HTMLSelectElement).value;
        this.applyFilter();
    }

    onSearchChange(event: Event): void {
        this.searchText = (event.target as HTMLInputElement).value;
        this.applyFilter();
    }

    viewDossier(id: number): void {
        this.router.navigate(['/dossiers/details', id]);
    }

    submitDossier(id: number): void {
        this.router.navigate(['/dossiers/submit', id]);
    }

    deleteDossier(id: number): void {
        if (confirm('Supprimer ce dossier ?')) {
            this.dossierService.deleteDossier(id).subscribe(() => this.loadDossiers());
        }
    }

    createDossier(): void {
        this.router.navigate(['/dossiers/create']);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'BROUILLON': return 'badge-gray';
            case 'EN_ATTENTE_VERIFICATION': return 'badge-yellow';
            case 'EN_COURS': return 'badge-blue';
            case 'APPROUVE': return 'badge-green';
            case 'REFUSE': return 'badge-red';
            default: return 'badge-gray';
        }
    }
}