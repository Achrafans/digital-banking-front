import { Customer } from './../model/customer.model';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { catchError, Observable, throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers!: Observable<Customer[]>;
  errorMessage!: string ;
  searchFormGroup: FormGroup | undefined;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder

  ){}

  ngOnInit(): void {
  this.searchFormGroup = this.fb.group({
    keyword: this.fb.control("")
  });

  this.handleSearchCustomers();
  }

  handleSearchCustomers(){
    console.log(this.searchFormGroup);
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
     catchError(err => {
      this.errorMessage = err.message;
      return throwError(err);
    }))

  }

 handleDeleteCustomer(c: Customer) {
  let conf = confirm("Are you sure ?");
  if(!conf) return;
  this.customerService.deleteCustomer(c.id).subscribe({
    next: () => {
      this.customers = this.customers.pipe(
        map((data: Customer[]) => {
          let index = data.indexOf(c);
          if (index > -1) {
            data.splice(index, 1); // supprime l'élément du tableau
          }
          return data;
        })
      );
    },
    error: (err) => {
      console.error(err);
    }
  });
}


}
