import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { UserManagementComponent } from './features/users/user-management/user-management.component';
import { TemplatesManagementComponent } from './features/templates/templates-management/templates-management.component';
import { ContentsManagementComponent } from './features/contents/contents-management/contents-management.component';
// import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: MainLayoutComponent, //LayoutComponent, 
        // canActivate: [AuthGuard],
        children: [
            // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: UserManagementComponent },
            { path: 'categories', component: CategoriesComponent},
            { path: 'templates', component: TemplatesManagementComponent},
            { path: 'contents', component: ContentsManagementComponent},
        ]
    },
    // { path: '**', redirectTo: 'dashboard' } // Redirect to dashboard for any unknown routes
];
