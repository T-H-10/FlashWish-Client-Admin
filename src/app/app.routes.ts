import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UsersComponent } from './features/users/users/users.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { BackgroundsComponent } from './features/backgrounds/backgrounds.component';
import { ContentsComponent } from './features/contents/contents.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { UserManagementComponent } from './features/users/user-management/user-management.component';
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
            { path: 'templates', component: BackgroundsComponent},
            { path: 'contents', component: ContentsComponent},
        ]
        // children: [
        //     {
        //         path: 'dashboard', component: DashboardComponent,
        //     },
        //     {
        //         path: 'users', component: UserManagementComponent,
        //         //  canActivate: [AuthGuard] 
        //     },
        //     {
        //         path: 'templates', component: TemplateManagementComponent,
        //         //  canActivate: [AuthGuard] 
        //     },
        //     {
        //         path: 'messages', component: GreetingMessagesListComponent,
        //         //  canActivate: [AuthGuard] 
        //     }]
    },
    // { path: '**', redirectTo: 'dashboard' } // Redirect to dashboard for any unknown routes
];
