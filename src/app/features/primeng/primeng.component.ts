import { Component, OnInit } from '@angular/core';
import { Customer, Product, ProductService } from './product.service';

@Component({
  selector: 'app-primeng',
  templateUrl: './primeng.component.html',
  styleUrls: ['./primeng.component.scss'],
})
export class PrimengComponent implements OnInit {
  customers1: Customer[];

  customers2: Customer[];

  selectedCustomer1: Customer;

  selectedCustomer2: Customer;

  constructor(private customerService: ProductService) {}

  ngOnInit() {
    this.customerService
      .getCustomersMedium()
      .then((data) => (this.customers1 = data));
    this.customerService
      .getCustomersMedium()
      .then((data) => (this.customers2 = data));
  }
}
