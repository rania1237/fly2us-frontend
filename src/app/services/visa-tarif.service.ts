import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VisaTarif {
    id?: number;
    visaType: string;
    priority: string;
    serviceFee: number;
    tlsFee?: number;
    totalAmount?: number;
    currency?: string;
    description?: string;
    active?: boolean;
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class VisaTarifService {

    private apiUrl = 'http://localhost:8083/api/visa-tarifs';

    constructor(private http: HttpClient) {}

    getAll(): Observable<VisaTarif[]> {
        return this.http.get<VisaTarif[]>(this.apiUrl);
    }

    getActive(): Observable<VisaTarif[]> {
        return this.http.get<VisaTarif[]>(`${this.apiUrl}/active`);
    }

    getById(id: number): Observable<VisaTarif> {
        return this.http.get<VisaTarif>(`${this.apiUrl}/${id}`);
    }

    // ✅ Nouveau : recherche par type + priorité
    search(visaType: string, priority: string): Observable<VisaTarif> {
        return this.http.get<VisaTarif>(
            `${this.apiUrl}/search?visaType=${visaType}&priority=${priority}`
        );
    }

    create(tarif: VisaTarif): Observable<VisaTarif> {
        return this.http.post<VisaTarif>(this.apiUrl, tarif);
    }

    update(id: number, tarif: VisaTarif): Observable<VisaTarif> {
        return this.http.put<VisaTarif>(`${this.apiUrl}/${id}`, tarif);
    }

    // ✅ Nouveau : sauvegarde en masse
    saveAll(tarifs: VisaTarif[]): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/batch`, tarifs);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}