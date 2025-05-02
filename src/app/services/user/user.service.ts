import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;
  private users:User[]=[];
  private userMap: Map<number, string>=new Map();

  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl+'/api/Users';
    this.getAllUsers().subscribe();
   }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl+'/Roles',{
      headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +localStorage.getItem('authToken') || '' 
       }
    }).pipe(
      tap((users: User[])=>{
        console.log(users);
        
        this.users=users;
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
    return this.userMap.get(id) || '---';
  }

  addUser({userName, email, password}:{userName: string, email: string, password: string}): Observable<User> {// use by userPostModel
    return this.http.post<User>(this.apiUrl, {userName, email, password});
  }

  updateUser(id:number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, {userName: user.userName, email: user.email, password: ''});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<User|null> {
    console.log(`${this.apiUrl}/email-exists?username=${email}`);
    
    return this.http.get<User|null>(`${this.apiUrl}/email-exists?email=${email}`);
  }
}
