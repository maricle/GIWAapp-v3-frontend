import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl,
  UntypedFormArray,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Estimate } from 'src/app/models/estimate';
import { AddedDialogComponent } from '../../invoice/add-invoice/added-dialog/added-dialog.component';
import { EstimateService } from 'src/app/services/estimate.service';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-add-estimate',
  templateUrl: './add-estimate.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],

})
export class AddEstimateComponent implements OnInit {
  addForm: UntypedFormGroup | any;
  rows: UntypedFormArray;

  ///////////////////////////////////////////////////////////

  // estimate: Estimate ;
  estimate: Estimate = {
    id: 0,
    date: new Date(),
    contact: 99, // Valor predeterminado para contacto
    doctype: 'estimate', // Tipo de documento predeterminado
    lines: [],
    description: '',
    draft: false,
    sent_mail: false,
    tag_sucursal: 'oficina'
  };
  subTotal: number = 0;
  vat: number = 0;
  grandTotal: number = 0;

  ///autocomplete
  customercontrol = new FormControl();
  filteredContacts!: Observable<any[]>;
  customers: Customer[] = [];
  selected_customer: Customer | null;
  ///


  ///autocomplete
  itemcontrol = new FormControl();
  filteredItems!: Observable<any[]>;
  items: any[] = [];
  selected_item: any | null;
  ///



  constructor(
    private fb: UntypedFormBuilder,
    private estimateService: EstimateService,
    private custormerService: CustomerService,
    private productService: ProductService,
    private router: Router,
    public dialog: MatDialog
  ) {
    console.log('entra edit ');
    this.getCustomers();
    this.getProducts();
    // tslint:disable-next-line - Disables all

    this.estimate.draft = false;

    ///////////////////////////////////////////////////////////

    this.addForm = this.fb.group({});

    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
    this.rows.push(this.createItemFormGroup());
  }
  ////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    // this.getCustomers();

    // Definir el Observable para filtrar los clientes según el texto ingresado
    console.log(this.estimate);

    // if (this.local_data.contact && this.customers.length > 0) {
    //   this.selected_customer = this.customers.find(customer => customer.id === this.local_data.contact) || null;
    //   this.myControl.setValue(this.selected_customer);
    // }

    const now = new Date();
    this.estimate.date = now;
    this.estimate.draft = true;
    console.log('add');

    this.filteredContacts = this.customercontrol.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.description)),
      map(description => description ? this._filterCustomer(description) : this.customers.slice())
    );

    // Asigna el valor seleccionado al objeto local_data.contact
    this.customercontrol.valueChanges.subscribe(selectedCustomer => {
      if (typeof selectedCustomer === 'object' && selectedCustomer !== null) {
        this.estimate.contact = selectedCustomer;
      }
    });


      // Asigna el valor seleccionado al objeto local_data.contact
      this.itemcontrol.valueChanges.subscribe(selected_item => {
        if (typeof selected_item === 'object' && selected_item !== null) {
          this.estimate.contact = selected_item;
        }
      });

  }



  async getCustomers() {
    try {
      this.customers = await lastValueFrom(this.custormerService.getAll());
      this.selected_customer = this.customers.find(customer => customer.id === this.estimate.contact) || null;
      // this.myControl.setValue(this.selected_customer);
      console.log(this.customers);

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  async getProducts() {
    try {
      this.items = await lastValueFrom(this.productService.getAll());
      // this.selected_item = this.items.find(item => item.id === this.estimate.contact) || null;
      // this.myControl.setValue(this.selected_customer);
      // console.log(this.customers);

    } catch (error) {
      console.error('Error fetching itemas/products', error);
    }
  }



  // filter option customer
  private _filterCustomer(description: string): any[] {
    const filterValue = description.toLowerCase();
    return this.customers.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayCustomer(cust: any): string {
    return cust && cust.name ? cust.name + ' ' + cust.last_name : '';
  }
  /////////////////////

  // filter option item
  private _filterItem(description: string): any[] {
    const filterValue = description.toLowerCase();
    return this.items.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayItem(prod: any): string {
    return prod && prod.name ? prod.name :'';
  }


  //////////////////////////////


  onAddRow(): void {
    this.rows.push(this.createItemFormGroup());
  }
  onRemoveRow(rowIndex: number): void {
    const totalCostOfItem =
      this.addForm.get('rows')?.value[rowIndex].unitPrice *
      this.addForm.get('rows')?.value[rowIndex].units;

    this.subTotal = this.subTotal - totalCostOfItem;
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(): UntypedFormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      units: ['', Validators.required],
      unitPrice: ['', Validators.required],
      itemTotal: ['0'],
    });
  }
  itemsChanged(): void {
    let total: number = 0;
    // tslint:disable-next-line - Disables all
    for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('rows')).length;
      t++
    ) {
      if (
        this.addForm.get('rows')?.value[t].unitPrice !== '' &&
        this.addForm.get('rows')?.value[t].units
      ) {
        total =
          this.addForm.get('rows')?.value[t].unitPrice *
          this.addForm.get('rows')?.value[t].units +
          total;
      }
    }
    this.subTotal = total;
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
  }
  ////////////////////////////////////////////////////////////////////

  saveDetail(): void {
    this.estimate.imp_total = this.grandTotal;
    this.estimate.imp_neto = this.subTotal;
    // this.invoice. = this.vat;
    // tslint:disable-next-line - Disables all
    // for (
    //   let t = 0;
    //   t < (<UntypedFormArray>this.addForm.get('rows')).length;
    //   t++
    // ) {
    //   const o: order = new order();
    //   o.itemName = this.addForm.get('rows')?.value[t].itemName;
    //   o.unitPrice = this.addForm.get('rows')?.value[t].unitPrice;
    //   o.units = this.addForm.get('rows')?.value[t].units;
    //   o.unitTotalPrice = o.units * o.unitPrice;
    //   this.invoice.orders.push(o);
    // }
    this.dialog.open(AddedDialogComponent);
    this.estimateService.create(this.estimate);
    this.router.navigate(['/apps/estimate']);
  }
}




