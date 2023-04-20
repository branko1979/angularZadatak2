import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{

  // sledeca f-ja sluzi za proveru password i repeatPassword
  passwordMatchValidator(form:FormGroup){
    const password = form.get('password'); // kupi pojedinacnu vrednost  iz input polja
    const confirmPassword = form.get('confirmPassword'); 

    if(password?.value !==confirmPassword?.value){
      confirmPassword?.setErrors({passwordMismatch:true})
    }else{
      confirmPassword?.setErrors(null);
    }
  }
  userForm!: FormGroup;
  dataSource =new MatTableDataSource<any>()
  displayColumns = ['ime','prezime','email','password','action'];

  constructor(private fb:FormBuilder){
  }

  ngOnInit(): void{
    this.userForm = this.fb.group({
      id:[0,[Validators.required]],
      firstName:["",[Validators.required]],
      secondName:["",[Validators.required]],
      email:["",[Validators.required, Validators.email]],
      password:["",[Validators.required]],
      confirmPassword:["",[Validators.required]]
    },{
    validator:this.passwordMatchValidator
    }
    )
    this.dataSource.data = JSON.parse(localStorage.getItem('userForm')??'');
  }

  save(){ //cuva se samo u local Storage, da se ne bi komplikovalo sa Api i bazama podataka
    //const userData: any[] = null; 
    const userData: any[] = [];

    const data = this.userForm.getRawValue();
    if(this.userForm.valid){
      data.id = Math.floor(1000 * Math.random()) // da se generisu jedinstveni brojevi - simulacija id iz baze
        if (localStorage.getItem('userForm') === null){ // ukoliko takav kljuc ne postoji
          userData.push(data); //dodavanje elementa u niz
          console.log("UserData",userData)
          console.log("UserDataString",JSON.stringify(userData))
          localStorage.setItem('userForm',JSON.stringify(userData))
        }else{
          const localData = JSON.parse(localStorage.getItem('userForm') ?? ''); // parsiramo iz stringa u objekat
          //  ?? '' znaci da ako je vraceno null onda povratni string bude ''
          localData.push(data); //dodavanje u niz
          localStorage.setItem('userForm',JSON.stringify(localData)) // niz objekata se u ovom slucaju cuva u localStorage
        }
        this.userForm.reset() // sva input polja ce se resetovati

        //this.userForm.get('id').setValue(0);
        this.userForm = this.fb.group({
          id:[0,[Validators.required]],
          firstName:["",[Validators.required]],
          secondName:["",[Validators.required]],
          email:["",[Validators.required, Validators.email]],
          password:["",[Validators.required]],
          confirmPassword:["",[Validators.required]]
        },{
        validator:this.passwordMatchValidator
        }
        ) // nije htela gornja komanda da proradi  - da se korisnik ponovo setuje na 0
        
        console.log(this.userForm.getRawValue())
        this.dataSource.data = []; // resetuje se da ne bi vracao duple podatke
        this.dataSource.data = JSON.parse(localStorage.getItem('userForm')??'');
        alert("Korisnik uspesno kreiran !")
    }else{
      alert("Neophodno je uneti ispravne podatke!")
    }

  }
  delete(data: any){
    console.log(data)
    var allData =JSON.parse(localStorage.getItem('userForm')??'');
    allData = allData.filter((item: any) =>item.id !== data.id);
    console.log(allData)
    localStorage.removeItem('userForm');
    localStorage.setItem('userForm',JSON.stringify(allData)) 
    this.dataSource.data = JSON.parse(localStorage.getItem('userForm')??'');
  }


}
