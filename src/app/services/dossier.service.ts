import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ====== INTERFACES ======
export interface Dossier {
    id?: number;
    dossierNumber?: string;
    clientId: number;
    clientName?: string;
    agentId?: number;
    type: string;
    country: string;
    status?: string;
    priority?: string;
    university?: string;
    program?: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
    rejectionReason?: string;
    submittedAt?: Date;
    createdAt?: Date;
}

export interface DossierDocument {
    id?: number;
    dossierId?: number;
    requirementId: number;
    documentType: string;
    documentName?: string;
    fileName: string;
    filePath?: string;
    fileSize?: number;
    fileType?: string;
    status: string;
    rejectionReason?: string;
    uploadedAt?: Date;
    uploadedBy?: number;
    validatedAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class DossierService {

    private apiUrl = 'http://localhost:8082/api/dossiers';

    constructor(private http: HttpClient) {}

    // ==========================================
    // CRUD DOSSIERS
    // ==========================================
    createDossier(dossier: Dossier): Observable<Dossier> {
        return this.http.post<Dossier>(this.apiUrl, dossier);
    }

    getAllDossiers(): Observable<Dossier[]> {
        return this.http.get<Dossier[]>(this.apiUrl);
    }

    getDossierById(id: number): Observable<Dossier> {
        return this.http.get<Dossier>(`${this.apiUrl}/${id}`);
    }

    getDossiersByClient(clientId: number): Observable<Dossier[]> {
        return this.http.get<Dossier[]>(`${this.apiUrl}/client/${clientId}`);
    }

    getDossiersByStatus(status: string): Observable<Dossier[]> {
        return this.http.get<Dossier[]>(`${this.apiUrl}/status/${status}`);
    }

    updateDossier(id: number, dossier: Dossier): Observable<Dossier> {
        return this.http.put<Dossier>(`${this.apiUrl}/${id}`, dossier);
    }

    deleteDossier(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // ==========================================
    // GESTION DES DOCUMENTS
    // ==========================================
    uploadDocument(dossierId: number, requirementId: number, file: File, userId: number): Observable<DossierDocument> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<DossierDocument>(
            `${this.apiUrl}/${dossierId}/documents/${requirementId}?userId=${userId}`,
            formData
        );
    }

    getDocumentsByDossier(dossierId: number): Observable<DossierDocument[]> {
        return this.http.get<DossierDocument[]>(`${this.apiUrl}/${dossierId}/documents`);
    }

    validateDocument(documentId: number, adminId: number): Observable<DossierDocument> {
        return this.http.put<DossierDocument>(
            `${this.apiUrl}/documents/${documentId}/validate?adminId=${adminId}`,
            {}
        );
    }

    rejectDocument(documentId: number, adminId: number, reason: string): Observable<DossierDocument> {
        return this.http.put<DossierDocument>(
            `${this.apiUrl}/documents/${documentId}/reject?adminId=${adminId}&reason=${encodeURIComponent(reason)}`,
            {}
        );
    }

    // ✅ TÉLÉCHARGER / VOIR UN FICHIER (via HTTP avec auth)
    downloadDocumentFile(documentId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/documents/${documentId}/file`, {
            responseType: 'blob'
        });
    }

    // ✅ URL DIRECTE vers le fichier (pour aperçu inline dans img/iframe)
    getDocumentFileUrl(documentId: number): string {
        return `${this.apiUrl}/documents/${documentId}/file`;
    }

    // ==========================================
    // ACTIONS DOSSIER
    // ==========================================
    isComplete(dossierId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/${dossierId}/is-complete`);
    }

    submitDossier(dossierId: number, clientId: number): Observable<Dossier> {
        return this.http.post<Dossier>(
            `${this.apiUrl}/${dossierId}/submit?clientId=${clientId}`,
            {}
        );
    }

    updateStatus(dossierId: number, status: string, comment: string): Observable<Dossier> {
        return this.http.patch<Dossier>(
            `${this.apiUrl}/${dossierId}/status`,
            { status, comment }
        );
    }

    // ==========================================
    // PDF
    // ==========================================
    downloadPdf(dossierId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${dossierId}/pdf`, {
            responseType: 'blob'
        });
    }
}