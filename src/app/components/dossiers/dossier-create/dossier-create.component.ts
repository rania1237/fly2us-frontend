import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DossierService, Dossier } from '../../../services/dossier.service';
import { AuthService } from '../../../services/auth.service';
import { COUNTRIES } from '../../../constants/countries';

@Component({
    selector: 'app-dossier-create',
    standalone: false,
    templateUrl: './dossier-create.component.html',
    styleUrls: ['./dossier-create.component.css']
})
export class DossierCreateComponent implements OnInit {

    // ✅ Liste des pays
    countries: string[] = COUNTRIES;

    dossier: Dossier = {
        clientId: 0,   // ✅ Sera rempli dynamiquement dans ngOnInit
        type: 'ETUDIANT',
        country: 'France',
        priority: 'NORMAL',
        university: '',
        program: ''
    };

    loading: boolean = false;
    errorMessage: string = '';

    constructor(
        private dossierService: DossierService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // ✅ Récupérer l'ID du user connecté
        this.dossier.clientId = this.authService.getCurrentUserId();
        console.log('👤 Nouveau dossier pour client ID:', this.dossier.clientId);
    }

    onSubmit(): void {
        if (!this.dossier.country) {
            this.errorMessage = 'Le pays est obligatoire';
            return;
        }

        if (!this.dossier.clientId || this.dossier.clientId === 0) {
            this.errorMessage = 'Vous devez être connecté';
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.dossierService.createDossier(this.dossier).subscribe({
            next: (created) => {
                alert('✅ Dossier créé : ' + created.dossierNumber);
                this.router.navigate(['/client/my-dossiers']);
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.errorMessage = 'Erreur lors de la création';
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/client/my-dossiers']);
    }
}