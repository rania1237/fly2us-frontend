import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ================= AUTH =================
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

// ================= CLIENT =================
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientMyDossiers } from './components/client-my-dossiers/client-my-dossiers';

// ================= ADMIN =================
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminDossiersComponent } from './components/admin-dossiers/admin-dossiers.component';
import { AdminDocumentsComponent } from './components/admin-documents/admin-documents.component';

// ================= ADMIN VISA =================
import { VisaListComponent } from './components/visas/visa-list/visa-list.component';
import { VisaAddComponent } from './components/visas/visa-add/visa-add.component';
import { VisaDetailsComponent } from './components/visas/visa-details/visa-details.component';

// ================= DOSSIERS =================
import { DossierListComponent } from './components/dossiers/dossier-list/dossier-list.component';
import { DossierCreateComponent } from './components/dossiers/dossier-create/dossier-create.component';
import { DossierSubmitComponent } from './components/dossiers/dossier-submit/dossier-submit.component';
import { DossierDetailsComponent } from './components/dossiers/dossier-details/dossier-details.component';

// ================= ✅ PAIEMENTS =================
import { AdminTarifs } from './components/admin-tarifs/admin-tarifs';
import { AdminPaiements } from './components/admin-paiements/admin-paiements';
import { ClientPaiement } from './components/client-paiement/client-paiement';

// ================= GUARDS =================
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [

    // ==========================================
    // 🔓 ROUTES PUBLIQUES
    // ==========================================
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },

    // ==========================================
    // 🔒 ROUTES CLIENT
    // ==========================================
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'client/my-dossiers', component: ClientMyDossiers, canActivate: [AuthGuard] },
    { path: 'client/dossiers/create', component: DossierCreateComponent, canActivate: [AuthGuard] },
    { path: 'client/dossier-submit/:id', component: DossierSubmitComponent, canActivate: [AuthGuard] },

    // ✅ CLIENT - Paiement
    { path: 'client/paiement/:id', component: ClientPaiement, canActivate: [AuthGuard] },

    // ==========================================
    // 🔐 ROUTES ADMIN
    // ==========================================
    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
    { path: 'admin/users', component: AdminUsersComponent, canActivate: [AdminGuard] },
    { path: 'admin/dossiers', component: AdminDossiersComponent, canActivate: [AdminGuard] },
    { path: 'admin/dossiers/details/:id', component: DossierDetailsComponent, canActivate: [AdminGuard] },
    { path: 'admin/documents', component: AdminDocumentsComponent, canActivate: [AdminGuard] },

    // Gestion des visas
    { path: 'admin/visas', component: VisaListComponent, canActivate: [AdminGuard] },
    { path: 'admin/visas/add', component: VisaAddComponent, canActivate: [AdminGuard] },
    { path: 'admin/visas/details/:id', component: VisaDetailsComponent, canActivate: [AdminGuard] },

    // ✅ ADMIN - Tarifs
    { path: 'admin/tarifs', component: AdminTarifs, canActivate: [AdminGuard] },

    // ✅ ADMIN - Paiements
    { path: 'admin/paiements', component: AdminPaiements, canActivate: [AdminGuard] },

    // ==========================================
    // 📍 REDIRECTION
    // ==========================================
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: '**', redirectTo: 'signin' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}