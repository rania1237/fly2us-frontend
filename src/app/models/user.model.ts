export interface User {
    id?: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'ADMIN' | 'CLIENT';
    active?: boolean;
    createdAt?: Date;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;  // ✅ OBLIGATOIRE
    role: 'ADMIN' | 'CLIENT';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
}