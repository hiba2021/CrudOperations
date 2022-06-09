import { User } from './../../model/user';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { UserService } from 'src/app/service/user.service';
import * as CryptoJS from 'crypto-js'


@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.css'],
  template:`
  <div class="container-fluid">

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Crud Operations</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#addUser" type="submit">Add User</button>
      </div>
    </div>
</nav>



<table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Employee ID</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Password</th>
        <th scope="col">Gender</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let user of usrList">
        <td>{{user.id}}</td>
        <td>{{user.username}}</td>
        <td>{{user.email}}</td>
        <td>{{ (user.password.length>6)? (user.password | slice:0:6)+'..':(user.password)}}</td>
        <td>{{user.gender}}</td>
        <td> 
            <button type="button" class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#editUser" (click)="editEmployee(user)">Edit</button>
            <button type="button" class="btn btn-outline-danger" (click)="deleteUser(user)">Delete</button>
        </td>

      </tr>
      
    </tbody>
  </table>


<!-- Add employee modal -->
<div class="modal fade" id="addUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Add new User</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      
        <form [formGroup]="usrDetail">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Name </label>
                <input type="text" formControlName="username" class="form-control" id="username" aria-describedby="emailHelp">
              </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email </label>
              <input type="email" formControlName="email" class="form-control" id="email" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Password </label>
                <input type="password" formControlName="password" class="form-control" id="email" aria-describedby="emailHelp">
              </div>
             
            <!-- radio button   -->
              <div>
                Gender:
              <div class="form-check">
                <input class="form-check-input" type="radio" formControlName="gender" id="male" value="male">
                <label class="form-check-label" for="male">
                  Male
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" formControlName="gender" id="female" value="female">
                <label class="form-check-label" for="female" checked>
                  Female
                </label>
            </div>
              </div>
          <!--  -->
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" (click)="addUser()">Add User</button>
              </div>
          </form>

    </div>
    
  </div>
</div>
</div>


<!-- Edit employee modal -->
<div class="modal fade" id="editUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Edit User details</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">

        <form [formGroup]="usrDetail">
            <div class="mb-3">
                <label for="exampleInputName" class="form-label">Name </label>
                <input type="text" formControlName="username" class="form-control" id="username" aria-describedby="usernameHelp">
              </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email </label>
              <input type="email" formControlName="email" class="form-control" id="email" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword" class="form-label">Password </label>
                <input type="text" formControlName="password" class="form-control" id="password" aria-describedby="passwordHelp">
              </div>
                <!-- radio button   -->
                <div>
                Gender:
              <div class="form-check">
                <input class="form-check-input" type="radio" formControlName="gender" id="male" value="male">
                <label class="form-check-label" for="male">
                  Male
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" formControlName="gender" id="female" value="female">
                <label class="form-check-label" for="female" checked>
                  Female
                </label>
            </div>
              </div>
          <!--  -->
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-success" (click)="updateUser()" data-bs-dismiss="modal">Update </button>
              </div>
          </form>

    </div>
  </div>
</div>
</div>


</div> 

  `
})
export class DashboardComponent implements OnInit {

  usrDetail !: FormGroup;
 usrObj : User = new User();
  usrList : User[] = [];

  public encryptedMessage!: string;
  public decryptedMessage!: string;

  constructor(
    private fb : FormBuilder, 
    private userService : UserService
    ) { }

  ngOnInit(): void {

    this.getAllUsers();
    this.usrDetail=this.fb.group({
      id : [''],
     username : [''],
     email:['',{
        validators:[Validators.required,Validators.email]
      }],
      password:['',Validators.required],
       gender:['']
  })
        

  }

  addUser() {
    console.log(this.usrDetail);
    this.usrObj.id = this.usrDetail.value.id;
    this.usrObj.username = this.usrDetail.value.username;
    this.usrObj.password = this.encrypt(this.usrDetail.value.password);
    this.usrObj.email = this.usrDetail.value.email;
    this.usrObj.gender = this.usrDetail.value.gender;

    

    this.userService.addUser(this.usrObj).subscribe((res:any)=>{
        console.log(res);
        this.getAllUsers();
    },(err:any)=>{
        console.log(err);
    });

  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((res:any)=>{
        this.usrList = res;
    },(err:any)=>{
      console.log("error while fetching data.")
    });
  }

  editEmployee(user : User) {
    this.usrObj.id=user.id;
    this.usrDetail.controls['id'].setValue(user.id);
    this.usrDetail.controls['username'].setValue(user.username);
    this.usrDetail.controls['email'].setValue(user.email);
    this.usrDetail.controls['password'].setValue(this.encrypt(user.password));
    this.usrDetail.controls['gender'].setValue(user.gender);


  }

  updateUser() {

    this.usrObj.id = this.usrDetail.value.id;
    this.usrObj.username = this.usrDetail.value.username;
    this.usrObj.password = this.encrypt(this.usrDetail.value.password);
    this.usrObj.email = this.usrDetail.value.email;
    this.usrObj.gender = this.usrDetail.value.gender;


    this.userService.updateUser(this.usrObj,this.usrObj.id).subscribe((res:any)=>{
      alert("updated Successfully");
      console.log(res, 'in update');
      this.getAllUsers();
    },(err:any)=>{
      console.log(err,'error in update');
    })

  }

  deleteUser(user : User) {

    this.userService.deleteUser(user).subscribe((res:any)=>{
      console.log(res);
      alert('User deleted successfully');
      this.getAllUsers();
    },(err:any) => {
      console.log(err);
    });

  }

  encrypt(password:string) {
   return this.encryptedMessage = CryptoJS.AES.encrypt( password.trim(), this.makeEncryptionPasword().trim()).toString();
   // this.decryptedMessage = CryptoJS.AES.decrypt( this.encryptedMessage,  this.makeEncryptionPasword().trim() ).toString(CryptoJS.enc.Utf8);
   }

 makeEncryptionPasword() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

}