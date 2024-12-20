import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Order } from 'src/app/models/order';
import { Customer } from 'src/app/models/customer';
import { Status } from 'src/app/models/status';
import { StatusService } from 'src/app/services/status.service';
import { lastValueFrom, Observable, map, startWith } from 'rxjs';
import { order } from '../invoice/invoice';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticketlist.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
})
export class AppTicketlistComponent implements AfterViewInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  searchText: any;
  totalCount = -1;
  Closed = -1;
  Inprogress = -1;
  Open = -1;
  design = -1;
  packaging = -1;


  displayedColumns: any[] = [
    'id',
    'name',
    'date',
    'contact',
    'priority',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<Order>;
  contacts: Customer[];
  statuss: Status[];
  orders: any;

  constructor(public dialog: MatDialog,
    public ordersService: OrderService,
    public customerService: CustomerService
  ) {


    console.log('entra constructor');
    this.loadOrders();
    // this.getCustomers(); 
  }


  async loadOrders() {

    try {
      console.log('entra init');
      this.orders = await this.ordersService.getAllContacts();
      this.Open = this.countBystatus(1);
      this.Closed = this.countBystatus(5);
      this.Inprogress = this.countBystatus(3);
      this.packaging = this.countBystatus(4);
      this.design = this.countBystatus(2);
      this.totalCount = this.orders.length;
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.dataSource.data = this.orders;
    } catch (error) {
      console.error('Error fetching orders', error);
    }

  }


  ngOnInit(): void {
    console.log('entra init');

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  countBystatus(val: number) {
    return this.orders.filter((m: any) => m.status == val).length;
  }

  btnCategoryClick(val: string) {
    this.dataSource.data = this.orders.filter((m: any) => m.status == parseInt(val));
    console.log(this.orders.filter((m: any) => m.status == parseInt(val)))
    if (val == '') {
      this.dataSource.data = this.orders;
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppTicketDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  async updateStatus(status:string,obj: any) {

    obj.status = status;
    obj.status_name='design';
    await this.updateRowData(obj);
    return true;

  }

  // tslint:disable-next-line - Disables all
  async addRowData(row_obj: Order) {
    console.log('data to add', row_obj);
    await this.ordersService.save(row_obj);
    this.dataSource.data.unshift(row_obj);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  async updateRowData(row_obj: Order) {

    if (row_obj.id) {
      await this.ordersService.update(row_obj.id, row_obj);
    }
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      if (value.id === row_obj.id) {
        value = row_obj;
      }
      return true;
    });
    return false;
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Order): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      return value.id !== row_obj.id;
    });
  }
}

/////////////////////////DIALOG////////////////////////////////////////////////////////////////////////

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'ticket-dialog-content.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
// tslint:disable-next-line - Disables all
export class AppTicketDialogContentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: Order; 
  selected_customer: Customer | null;
  statuss: any[] = [];

  ///autocomplete
  customercontrol = new FormControl();
  filteredContacts!: Observable<any[]>;
  customers: Customer[] = [];
  /////


  constructor(
    public dialogRef: MatDialogRef<AppTicketDialogContentComponent>,
    private customerService: CustomerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.action = data.action;
    this.local_data = data as Order;
    console.log(this.action);

  }

  ngOnInit(): void {
    this.getCustomers();

    // Definir el Observable para filtrar los clientes según el texto ingresado
    console.log(this.local_data);
    
    // if (this.local_data.contact && this.customers.length > 0) {
    //   this.selected_customer = this.customers.find(customer => customer.id === this.local_data.contact) || null;
    //   this.myControl.setValue(this.selected_customer);
    // }

    if (this.action == 'Add') {
      const now = new Date();
      this.local_data.date = now.toISOString().split('T')[0];
      this.local_data.status = 1;
      console.log('add');
    }

    this.filteredContacts = this.customercontrol.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.description)),
      map(description => description ? this._filterCustomer(description) : this.customers.slice())
    );
    
    // Asigna el valor seleccionado al objeto local_data.contact
    this.customercontrol.valueChanges.subscribe(selectedCustomer => {
      if (typeof selectedCustomer === 'object' && selectedCustomer !== null) {
        this.local_data.contact = selectedCustomer;
      }
    });

  }
    // filter option customer
    private _filterCustomer(description: string): any[] {
      const filterValue = description.toLowerCase();
      return this.customers.filter(option => option.name.toLowerCase().includes(filterValue));
    }


    displayCustomer(cust: any): string {
      return cust && cust.description ? cust.name+ ' '+ cust.lastname : '';
    }
  
  

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    // Access the selected value
    console.log(event.option.value);
    const selectedOption = event.option.value;
    this.local_data.contact = selectedOption;

    console.log('Selected Value:', selectedOption);

  }

  async getCustomers() {
    try {
      this.customers = await lastValueFrom(this.customerService.getAll());
      this.selected_customer = this.customers.find(customer => customer.id === this.local_data.contact) || null;
      // this.myControl.setValue(this.selected_customer);
      console.log(this.customers);

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }




  doAction(): void {
    console.log('from doaction', this.local_data);
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
