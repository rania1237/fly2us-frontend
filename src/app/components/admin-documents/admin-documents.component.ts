import { Component, OnInit } from '@angular/core';
import { DocumentRequirementService, DocumentRequirement } from '../../services/document-requirement.service';

// ====== LISTE PRÉDÉFINIE ======
export interface PredefinedDocument {
    code: string;
    name: string;
    description: string;
    acceptedFormats: string;
    maxSizeMb: number;
    icon: string;
}

@Component({
    selector: 'app-admin-documents',
    standalone: false,
    templateUrl: './admin-documents.component.html',
    styleUrls: ['./admin-documents.component.css']
})
export class AdminDocumentsComponent implements OnInit {

    // ====== LISTE PRÉDÉFINIE ======
    predefinedDocuments: PredefinedDocument[] = [
        { code: 'PASSPORT', name: 'Passeport', description: 'Passeport valide au moins 6 mois', acceptedFormats: 'PDF,JPG,PNG', maxSizeMb: 10, icon: '🛂' },
        { code: 'PHOTO', name: 'Photo d\'identité', description: 'Photo récente format identité', acceptedFormats: 'JPG,PNG', maxSizeMb: 5, icon: '📷' },
        { code: 'BIRTH_CERT', name: 'Acte de naissance', description: 'Acte de naissance officiel', acceptedFormats: 'PDF,JPG', maxSizeMb: 5, icon: '📜' },
        { code: 'DIPLOMA', name: 'Diplôme', description: 'Diplôme du baccalauréat ou licence', acceptedFormats: 'PDF', maxSizeMb: 10, icon: '🎓' },
        { code: 'TRANSCRIPT', name: 'Relevé de notes', description: 'Relevés des 2 dernières années', acceptedFormats: 'PDF', maxSizeMb: 10, icon: '📊' },
        { code: 'ENROLLMENT', name: 'Attestation d\'inscription', description: 'Lettre d\'admission de l\'université', acceptedFormats: 'PDF', maxSizeMb: 10, icon: '📝' },
        { code: 'BANK_STATEMENT', name: 'Justificatif financier', description: 'Relevés bancaires des 3 derniers mois', acceptedFormats: 'PDF', maxSizeMb: 10, icon: '💰' },
        { code: 'MEDICAL', name: 'Certificat médical', description: 'Certificat médical récent', acceptedFormats: 'PDF,JPG', maxSizeMb: 5, icon: '🏥' },
        { code: 'INSURANCE', name: 'Assurance voyage', description: 'Attestation d\'assurance', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '🛡️' },
        { code: 'ACCOMMODATION', name: 'Justificatif hébergement', description: 'Attestation de logement', acceptedFormats: 'PDF', maxSizeMb: 10, icon: '🏠' },
        { code: 'FLIGHT_TICKET', name: 'Billet d\'avion', description: 'Réservation aller-retour', acceptedFormats: 'PDF,JPG', maxSizeMb: 5, icon: '✈️' },
        { code: 'HOTEL', name: 'Réservation hôtel', description: 'Confirmation de réservation', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '🏨' },
        { code: 'VISA_FORM', name: 'Formulaire de visa', description: 'Formulaire rempli et signé', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '📋' },
        { code: 'CV', name: 'CV', description: 'Curriculum Vitae', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '📄' },
        { code: 'MOTIVATION_LETTER', name: 'Lettre de motivation', description: 'Lettre expliquant le projet', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '✉️' },
        { code: 'LANGUAGE_TEST', name: 'Test de langue', description: 'TOEFL, IELTS, etc.', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '🗣️' },
        { code: 'SPONSOR_LETTER', name: 'Lettre de prise en charge', description: 'Attestation du sponsor', acceptedFormats: 'PDF', maxSizeMb: 5, icon: '🤝' }
    ];

    // ====== DOCUMENTS SÉLECTIONNÉS ======
    selectedDocuments: PredefinedDocument[] = [];

    // ====== DOCUMENTS DÉJÀ AJOUTÉS ======
    requirements: DocumentRequirement[] = [];
    filteredRequirements: DocumentRequirement[] = [];

    // ====== ÉTAT ======
    loading: boolean = false;
    message: string = '';
    errorMessage: string = '';
    showList: boolean = false;

    // ====== FILTRE ======
    selectedVisaType: string = 'ETUDIANT';
    visaTypes = ['ETUDIANT', 'TOURISTIQUE', 'SCHENGEN'];

    constructor(private service: DocumentRequirementService) {}

    ngOnInit(): void {
        this.loadAll();
    }

    // ==========================================
    // CHARGEMENT
    // ==========================================
    loadAll(): void {
        this.loading = true;
        this.service.getAll().subscribe({
            next: (data) => {
                this.requirements = data;
                this.applyFilter();
                this.loading = false;
            },
            error: () => {
                this.errorMessage = 'Erreur lors du chargement';
                this.loading = false;
            }
        });
    }

    applyFilter(): void {
        this.filteredRequirements = this.requirements.filter(
            r => r.visaType === this.selectedVisaType
        );
    }

    onVisaTypeChange(event: Event): void {
        this.selectedVisaType = (event.target as HTMLSelectElement).value;
        this.applyFilter();
    }

    // ==========================================
    // SÉLECTION DE DOCUMENTS
    // ==========================================
    toggleDocument(doc: PredefinedDocument): void {
        const index = this.selectedDocuments.findIndex(d => d.code === doc.code);
        if (index === -1) {
            this.selectedDocuments.push(doc);
        } else {
            this.selectedDocuments.splice(index, 1);
        }
    }

    isSelected(doc: PredefinedDocument): boolean {
        return this.selectedDocuments.some(d => d.code === doc.code);
    }

    // ==========================================
    // AJOUTER LES DOCUMENTS SÉLECTIONNÉS
    // ==========================================
    addSelectedDocuments(): void {
        if (this.selectedDocuments.length === 0) {
            this.errorMessage = 'Veuillez sélectionner au moins un document';
            return;
        }

        let completed = 0;
        const total = this.selectedDocuments.length;

        this.selectedDocuments.forEach(doc => {
            const requirement: DocumentRequirement = {
                visaType: this.selectedVisaType,
                documentName: doc.name,
                documentCode: doc.code,
                required: true,
                description: doc.description,
                acceptedFormats: doc.acceptedFormats,
                maxSizeMb: doc.maxSizeMb
            };

            this.service.create(requirement).subscribe({
                next: () => {
                    completed++;
                    if (completed === total) {
                        this.message = `✅ ${total} document(s) ajouté(s) pour ${this.selectedVisaType}`;
                        this.selectedDocuments = [];
                        this.showList = false;
                        this.loadAll();
                    }
                },
                error: () => {
                    this.errorMessage = '❌ Erreur lors de l\'ajout';
                }
            });
        });
    }

    // ==========================================
    // SUPPRESSION
    // ==========================================
    deleteRequirement(req: DocumentRequirement): void {
        if (!confirm(`Supprimer "${req.documentName}" ?`)) return;

        this.service.delete(req.id!).subscribe({
            next: () => {
                this.message = '🗑️ Document supprimé';
                this.loadAll();
            },
            error: () => {
                this.errorMessage = '❌ Erreur lors de la suppression';
            }
        });
    }

    // ==========================================
    // TOGGLE
    // ==========================================
    toggleList(): void {
        this.showList = !this.showList;
        this.selectedDocuments = [];
        this.message = '';
        this.errorMessage = '';
    }
}