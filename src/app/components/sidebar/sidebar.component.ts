import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    role: string = '';

    constructor(
        private tokenService: TokenService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // ✅ Récupérer le rôle
        const r = this.tokenService.getRole();
        this.role = r || '';
        console.log('📍 Sidebar - rôle:', this.role);
    }

    logout(): void {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            this.tokenService.logout();
            this.router.navigate(['/signin']);
        }
    }
}