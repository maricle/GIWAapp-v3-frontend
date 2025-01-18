import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl,
  FormArray,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Estimate } from 'src/app/models/estimate';
import { AddedDialogComponent } from '../../invoice/add-invoice/added-dialog/added-dialog.component';
import { EstimateService } from 'src/app/services/estimate.service';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { EstimateLine } from 'src/app/models/estimateLine';
import { AppDialogComponent } from 'src/app/pages/ui-components/dialog/dialog.component';


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

  id: any;
  addForm: FormGroup | any;
  customerForm: FormGroup | any;
  rows: FormArray;



  estimate: Estimate = {
    id: 0,
    date: new Date().toISOString().split('T')[0],
    contact: 15, // Valor predeterminado para contacto
    doctype: 'estimate', // Tipo de documento predeterminado
    puntodeventa: '1',
    lines: [],
    description: '',
    draft: false,
    sent_mail: false,
    tag_sucursal: 'oficina',

  };
  subTotal: number = 0;
  vat: number = 0;
  grandTotal: number = 0;
  ///autocomplete
  customercontrol = new FormControl();
  filteredContacts!: Observable<Contact[]>;
  customers: Contact[] = [];
  selected_customer: Contact | null;
  ///


  ///autocomplete
  itemcontrol = new FormControl();
  filteredItems!: Observable<Product[]>;
  items: Product[] = [];
  selected_item: Product | null;
  ///



  constructor(
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private estimateService: EstimateService,
    private custormerService: ContactService,
    private productService: ProductService,
    private router: Router,
    public dialog: MatDialog
  ) {


    this.addForm = this.fb.group({
      id: [''],
      date: [new Date(), Validators.required],
      contact: ['', Validators.required],
      doctype: ['estimate'],
      puntodeventa: ['1', Validators.required],
      description: [''],
      draft: [false],
      sent_mail: [false],
      tag_sucursal: ['oficina'],
      imp_total: [0],
      imp_neto: [0],
      lines: this.fb.array([]),
    });

    this.customerForm = this.fb.group({
      customer: ['', Validators.required],
      docNumber: ['', Validators.required],
      email: ['', Validators.required],
      cellphone: ['', Validators.required]
    });
    // this.rows = this.fb.array([]);
    // this.addForm.addControl('lines', this.rows);
    this.addForm.get('lines')?.push(this.createItemFormGroup());

  }
  ////////////////////////////////////////////////////////////////////////////////////
  // Initialize default values for new estimate

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.getCustomers();
    this.getProducts();
    // tslint:disable-next-line - Disables all

    ///////////////////////////////////////////////////////////
    // this.loadEstimateData(this.id);


   


    this.filteredContacts = this.customercontrol.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => name ? this._filterCustomer(name) : this.customers.slice())
    );
    // Asigna el valor seleccionado al objeto estimate.contact
    this.customercontrol.valueChanges.subscribe(selectedCustomer => {
      if (typeof selectedCustomer === 'object' && selectedCustomer !== null) {
        this.estimate.contact = selectedCustomer;
        this.addForm.patchValue(this.estimate);
      }
    });

    //autocomplete items  
    this.filteredItems = this.itemcontrol.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => name ? this._filterItem(name) : this.items.slice())
    );


    // Asigna el valor seleccionado al objeto local_data.contact
    // this.itemcontrol.valueChanges.subscribe(selected_item => {
    //   if (typeof selected_item === 'object' && selected_item !== null) {
    //       this.rows.push(this.createItemFormGroup(selected_item));
    //   }
    // });
    if ( this.id == 0) {
      console.log(this.id +'==id');
      this.estimate.contact = 15;
      this.addForm.patchValue(this.estimate);  
      console.log(this.estimate);
      console.log('new');
    } else {
      console.log(this.estimate);
      this.estimateService.getById(this.id).subscribe((data: any) => {
        this.estimate = data;
        // this.estimate.contact = this.customers.find(customer => customer.id === this.estimate.contact) || null;
        // this.loadData(data);
        this.addForm.patchValue(this.estimate);
      });
    }

  }

  loadEstimateData(id: any) {
    this.estimateService.getById(id).subscribe((data: any) => {
      this.estimate = data;
      this.addForm.patchValue(this.estimate);
      this.estimate.lines.forEach(line => {
        this.rows.push(this.createItemFormGroup(line));
      });
    });
  }




  async getCustomers() {
    try {
      this.customers = await lastValueFrom(this.custormerService.getAll());
      this.selected_customer = this.customers.find(customer => customer.id === this.estimate.contact) || null;
      // this.myControl.setValue(this.selected_customer);

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  async getProducts() {
    try {
      this.items = await lastValueFrom(this.productService.getAll());
      // this.selected_item = this.items.find(item => item.id === this.estimate.contact) || null;
      // this.myControl.setValue(this.selected_customer);
      console.log(this.items);

    } catch (error) {
      console.error('Error fetching itemas/products', error);
    }
  }



  // filter option customer
  private _filterCustomer(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.customers.filter(customer =>
      `${customer.name} ${customer.last_name}`.toLowerCase().includes(filterValue)
    );
  }

  displayCustomer(customer: Contact): string {
    return customer && customer.name ? customer.name + ' ' + customer.last_name : '';
  }
  /////////////////////

  // filter option item
  private _filterItem(description: string): any[] {
    const filterValue = description.toLowerCase();
    return this.items.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayItem(prod: any): string {
    return prod && prod.name ? prod.name : '';
  }


  //////////////////////////////


  onAddRow(): void {
    this.addForm.get('lines')?.push(this.createItemFormGroup());
    this.itemsChanged();
  }

  onRemoveRow(rowIndex: number): void {
    const totalCostOfItem =
      this.addForm.get('lines')?.value[rowIndex].unitPrice *
      this.addForm.get('lines')?.value[rowIndex].amount;

    this.subTotal = this.subTotal - totalCostOfItem;
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
    this.addForm.get('lines')?.removeAt(rowIndex);
    this.itemsChanged();
  }

  createItemFormGroup(line: EstimateLine | null = null): UntypedFormGroup {
    if (line) {
      return this.fb.group({
        itemName: [line?.itemName || '', Validators.required],
        amount: [line?.amount || ''],
        unit_price: [line?.unit_price || '', Validators.required],
        item_total: [line?.itemTotal || ''],
        // tax_percentage: [line?.tax_percentage || ''],
        // tax_value: [line?.tax_value || ''],
      });
    } else {
      return this.fb.group({
        item_name: ['', Validators.required],
        amount: [''],
        unit_price: ['', Validators.required],
      });
    }


  }
  onItemSelected(event: any, row: FormGroup): void {
    console.log(event);
    row.get('product_id')?.setValue(event.id);
    row.get('item_name')?.setValue(event.name);
    row.get('unit_price')?.setValue(event.price);
    row.get('amount')?.setValue(1);
    this.itemsChanged();
  }


  itemsChanged(): void {
    console.log('itemsChanged');
    console.log(this.addForm.value);
    const rows = this.addForm.get('lines') as FormArray;

    this.subTotal = rows.controls.reduce((total, row) => {
      const unit_price = row.get('unit_price')?.value;
      const amount = row.get('amount')?.value;
      const item_name = row.get('item_name')?.value;
      const item_total = row.get('item_total')?.value;


      if (unit_price && amount) {
        // Update the itemTotal control
        const itemTotal = unit_price * amount;
        row.get('item_total')?.setValue(itemTotal);

        return total + itemTotal;
      }
      return total;
    }, 0);

    // Calculate VAT and grand total
    this.vat = this.subTotal / 10;
    this.grandTotal = this.subTotal + this.vat;
  }
  ////////////////////////////////////////////////////////////////////

  saveDetail(): void {

    console.log('entra saveDetail'); 

    const estimate_val: Estimate = { 
      lines: this.addForm.get('lines').value.map((line: any) => ({
        description: line.item_name, // Fixed field name from 'desciption'
        amount: line.amount,
        unit_price: line.unit_price,
        tax: this.vat,
        total_price: line.item_total,
        discount: 0,
        product: line.product_id,
        invoice: null
      })),
      doctype: 'estimate',
      puntodeventa: "1",
      draft: this.addForm.get('draft').value,
      sent_mail: false,
      tag_sucursal: 'oficina',
      date: new Date().toISOString().split('T')[0],
      contact: this.customercontrol.value.id,
      imp_total: this.grandTotal, // Convert to string as required by backend
      // imp_neto: this.subTotal.toString(), // Convert to string as required by backend
      // Additional required fields from the model
      impIVA: this.vat,
    };
    console.log('estimate_val',estimate_val);
    lastValueFrom(this.estimateService.create(estimate_val)).then((data: any) => {
      this.router.navigate(['/apps/estimate']);
      this.dialog.open(AddedDialogComponent);
    }).catch((error) => {
      console.log('error', error);
    });
  }
}





