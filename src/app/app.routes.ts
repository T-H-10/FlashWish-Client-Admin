import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { TemplateManagementComponent } from './pages/template-management/template-management.component';
import { GreetingMessagesListComponent } from './pages/greeting-messages-list/greeting-messages-list.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent,
         canActivate: [AuthGuard] 
        },
    { path: 'users', component: UserManagementComponent,
        //  canActivate: [AuthGuard] 
        },
    { path: 'templates', component: TemplateManagementComponent,
        //  canActivate: [AuthGuard] 
        },
    { path: 'messages', component: GreetingMessagesListComponent,
        //  canActivate: [AuthGuard] 
        },
];
