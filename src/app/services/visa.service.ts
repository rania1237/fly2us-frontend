import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Visa {
    id?: number;
    type: string;
    country: string;
    flag: string;
    image: string;
    description: string;
    requirements: string[];
    duration: string;
    processingTime: string;
    price: number;
}

@Injectable({
    providedIn: 'root'
})
export class VisaService {

    private apiUrl = 'http://localhost:8086/api/visas';

    constructor(private http: HttpClient) {}

    getAllVisas(): Observable<Visa[]> {
        return this.http.get<Visa[]>(this.apiUrl);
    }

    getVisaById(id: number): Observable<Visa> {
        return this.http.get<Visa>(`${this.apiUrl}/${id}`);
    }

    createVisa(visa: Visa): Observable<Visa> {
        return this.http.post<Visa>(this.apiUrl, visa);
    }

    deleteVisa(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}