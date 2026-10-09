import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ====== INTERFACE ======
export interface DocumentRequirement {
    id?: number;
    visaType: string;
    documentName: string;
    documentCode: string;
    required: boolean;
    description?: string;
    acceptedFormats?: string;
    maxSizeMb?: number;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentRequirementService {

    private apiUrl = 'http://localhost:8082/api/document-requirements';

    constructor(private http: HttpClient) {}

    // ==========================================
    // RÉCUPÉRER TOUS LES DOCUMENTS (Admin)
    // ==========================================
    getAll(): Observable<DocumentRequirement[]> {
        return this.http.get<DocumentRequirement[]>(this.apiUrl);
    }

    // ==========================================
    // RÉCUPÉRER LES DOCUMENTS PAR TYPE DE VISA (Client)
    // ==========================================
    getByVisaType(visaType: string): Observable<DocumentRequirement[]> {
        return this.http.get<DocumentRequirement[]>(`${this.apiUrl}/visa-type/${visaType}`);
    }

    // ==========================================
    // RÉCUPÉRER UN DOCUMENT PAR ID
    // ==========================================
    getById(id: number): Observable<DocumentRequirement> {
        return this.http.get<DocumentRequirement>(`${this.apiUrl}/${id}`);
    }

    // ==========================================
    // CRÉER UN DOCUMENT REQUIS (Admin)
    // ==========================================
    create(requirement: DocumentRequirement): Observable<DocumentRequirement> {
        return this.http.post<DocumentRequirement>(this.apiUrl, requirement);
    }

    // ==========================================
    // METTRE À JOUR UN DOCUMENT REQUIS (Admin)
    // ==========================================
    update(id: number, requirement: DocumentRequirement): Observable<DocumentRequirement> {
        return this.http.put<DocumentRequirement>(`${this.apiUrl}/${id}`, requirement);
    }

    // ==========================================
    // SUPPRIMER UN DOCUMENT REQUIS (Admin)
    // ==========================================
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}