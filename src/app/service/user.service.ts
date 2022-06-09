import { User } from './../model/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http : HttpClient) {}

   addUser(user : User): Observable<User> {
     return this.http.post<User>('http://localhost:3000/posts',user)
     .pipe(map((res:any)=>{
       return res;
     }));
   }

   getAllUsers(): Observable<User[]>{
     return this.http.get<User[]>('http://localhost:3000/posts');
   }

   updateUser(user:User,id:number) : Observable<User>{

     return this.http.put<User>('http://localhost:3000/posts/'+id, user).pipe(map((res:any)=>{
      return res;
    }));
   }

   deleteUser(user : User) : Observable<User> {
     return this.http.delete<User>('http://localhost:3000/posts'+'/'+user.id);
   }
  

}