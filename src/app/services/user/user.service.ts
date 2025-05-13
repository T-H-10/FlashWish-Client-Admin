import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;
  private users:User[]=[];
  private userMap: Map<number, string>=new Map();

  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl+'/api';
    this.getAllUsers().subscribe();
   }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl+'/Users/Roles',{
      headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +localStorage.getItem('authToken') || '' 
       }
    }).pipe(
      tap((users: User[])=>{   
        this.users=users;
        console.log(users);
        
        this.userMap=new Map(users.map((user: User)=>[user.id, user.userName]));
      })
    );
  }

  // getUserById(id: number): Observable<User> {
  //   return this.http.get<User>(`${this.apiUrl}/${id}`);
  // }

  
    // refreshMap(categories: Category[]) {
    //   this.categories = categories;
    //   this.categoryMap = new Map(categories.map(c => [c.categoryID, c.categoryName]));
    // }
  
  getUserNameById(id:number):string{
    console.log(this.userMap);
    
    return this.userMap.get(id) || '---';
  }

  addUser({userName, email, password}:{userName: string, email: string, password: string}): Observable<User> {// use by userPostModel
    return this.http.post<{ user:User, token:string}>(this.apiUrl+'/Auth/register', {userName, email, password}).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  updateUser(id:number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/Users/${id}`, {userName: user.userName, email: user.email, password: ''});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Users/${id}`);
  }

  getUserByEmail(email: string): Observable<User|null> {
    console.log(`${this.apiUrl}/Users/email-exists?username=${email}`);
    
    return this.http.get<User|null>(`${this.apiUrl}/Users/email-exists?email=${email}`);
  }

  addAdminRole(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Users/${id}/add-admin-role`, {}).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

  removeAdminRole(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Users/${id}/remove-admin-role`, {}).pipe(
      catchError((error) => {
        console.log(error);
        return of(error);
      })
    );
  }

}
