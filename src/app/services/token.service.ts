import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private TOKEN_KEY = 'auth_token';
    private USER_KEY = 'auth_user';
    private ROLE_KEY = 'auth_role';
    private USER_ID_KEY = 'auth_userId';

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setUser(email: string): void {
        localStorage.setItem(this.USER_KEY, email);
    }

    getUser(): string | null {
        return localStorage.getItem(this.USER_KEY);
    }

    setRole(role: string): void {
        localStorage.setItem(this.ROLE_KEY, role);
    }

    getRole(): string | null {
        const role = localStorage.getItem(this.ROLE_KEY);
        if (role) return role;

        // Fallback : décoder le JWT
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || payload.Role || null;
        } catch {
            return null;
        }
    }

    setUserId(id: number): void {
        localStorage.setItem(this.USER_ID_KEY, id.toString());
    }

    getUserId(): number {
        const id = localStorage.getItem(this.USER_ID_KEY);
        if (id) return Number(id);

        const token = this.getToken();
        if (!token) return 0;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Number(payload.id) || 0;
        } catch {
            return 0;
        }
    }

    getEmail(): string {
        const email = this.getUser();
        if (email) return email;

        const token = this.getToken();
        if (!token) return '';

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || '';
        } catch {
            return '';
        }
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        localStorage.removeItem(this.USER_ID_KEY);
    }
}