import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { TemplateManagementComponent } from './pages/template-management/template-management.component';
import { GreetingMessagesListComponent } from './pages/greeting-messages-list/greeting-messages-list.component';

export const routes: Routes = [
{path: '', component: DashboardComponent},
{path: 'users', component: UserManagementComponent},
{path: 'templates', component: TemplateManagementComponent},
{path: 'messages', component: GreetingMessagesListComponent},
];
