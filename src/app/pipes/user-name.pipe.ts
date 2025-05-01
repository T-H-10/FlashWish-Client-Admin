import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Pipe({
  name: 'userName',
  standalone: true
})
export class UserNamePipe implements PipeTransform {

 
   constructor(private userService: UserService){}
   
   transform(userID: number): string {
    return this.userService.getUserNameById(userID);
   }

}
