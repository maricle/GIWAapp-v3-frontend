import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { Contact } from './contact';
// import { ContactService } from './contact.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CustomerService } from 'src/app/services/customer.service';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Doctype } from 'src/app/models/doctype';
import { Taxcondition } from 'src/app/models/taxcondition';
import { DoctypeService } from 'src/app/services/doctype.service';
import { TaxconditionService } from 'src/app/services/taxcondition.service';
import { TranslateModule } from '@ngx-translate/core';
 

@Component({
  templateUrl: './contact.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    TranslateModule
  ],
  standalone: true,
})
export class AppContactComponent implements OnInit {
  closeResult = '';
  contacts: Customer[] | undefined = [];
  contactsFiltered: Customer[] | undefined = [];
  items: Customer[] = [];

  doctypes: Doctype[] = [];
  taxconditions: Taxcondition[] = [];

  customer: Customer = {} as Customer;

  searchText: any;
  txtContactname = '';
  txtContactPost = '';
  txtContactadd = '';
  txtContactno = '';
  txtContactinstagram = '';
  txtContactlinkedin = '';
  txtContactfacebook = '';



  constructor(
    public dialog: MatDialog,
    private customerService: CustomerService,
    private doctypeService: DoctypeService,
    private taxconditionService: TaxconditionService
  ) {
    // this.contacts = this.contactService.getContacts();
    this.loadContacts();
    // this.getDocTypes();
    // this.getTaxcondition();

    //console.log(this.contacts);
  }

  ngOnInit(): void {

  }




  async loadContacts() {
    try {
      this.contacts = await lastValueFrom(this.customerService.getAll());
      this.contactsFiltered = this.contacts;

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  async getDocTypes() {
    try {
      this.doctypes = await lastValueFrom(this.doctypeService.getAll());

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }


  async getTaxcondition() {
    try {
      this.taxconditions = await lastValueFrom(this.taxconditionService.getAll());
      console.log(this.items);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }


  getTaxDetail(id: number) {
    return this.taxconditions.find(m => m.id = id)?.description;
  }


  getDocDetail(id: number) {
    return this.doctypes.find(m => m.id = id)?.description;
  }


  openDialog(action: string, obj: any): void {
    // obj.action = action;
    const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addContact(result.data);
      }
    });
  }


  clearFilter() {
    this.loadContacts()
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contacts = this.filter(filterValue);
  }


  filter(v: string): Customer[] | undefined {

    this.contactsFiltered = this.contacts?.filter(
      (x) => x.name.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
    return this.contactsFiltered;
  }

 

  // tslint:disable-next-line - Disables all
  async addContact(item: Customer): Promise<void> {
    console.log(item);

    if (item.name?.trim()) {
      if (item.id) {
        // @ts-ignore
        // this.items[this.findIndexById(this.item.id)] = this.item;          
        console.log('edit');
        await this.customerService.update(item.id, item);
      } else {

        console.log('new');
        await this.customerService.create(item);
        this.contacts?.push(item);
      }

      // this.contacts = [...this.items];
      await this.loadContacts();

    }



    // this.contacts.unshift({
    //   contactimg: 'assets/images/profile/user-1.jpg',
    //   contactname: row_obj.txtContactname,
    //   contactpost: row_obj.txtContactPost,
    //   contactadd: row_obj.txtContactadd,
    //   contactno: row_obj.txtContactno,
    //   contactinstagram: row_obj.txtContactinstagram,
    //   contactlinkedin: row_obj.txtContactlinkedin,
    //   contactfacebook: row_obj.txtContactfacebook,
    // });
  }
}


/////////////////////////////////////////////////////DIALOG COMPONENT///////////////////////////////////////////
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'contact-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppContactDialogContentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: Customer;

  // filter option DT
  doctypeControl = new FormControl();
  filteredDoctypes!: Observable<any[]>;
  doctypes: Doctype[] = [];

  //filter taxconditions   TC
  taxconditionControl = new FormControl();
  filteredTaxconditions!: Observable<any[]>;
  taxconditions: Taxcondition[] = [];

  constructor(
    public dialogRef: MatDialogRef<AppContactDialogContentComponent>,
    private doctypeService: DoctypeService,
    private taxconditionService: TaxconditionService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);

    this.local_data = data;
    this.action = data.action;
  }


  ngOnInit(): void {
    this.getDocTypes();
    this.getTaxcondition();
    // filter option DT
    this.filteredDoctypes = this.doctypeControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.description)),
      map(description => description ? this._filterDoctype(description) : this.doctypes.slice())
    );
    // filter option TC
    this.filteredTaxconditions = this.taxconditionControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.description)),
      map(description => description ? this._filterTaxconditions(description) : this.doctypes.slice())
    );
  }


  // filter option DT
  private _filterDoctype(description: string): any[] {
    const filterValue = description.toLowerCase();
    return this.doctypes.filter(option => option.description.toLowerCase().includes(filterValue));
  }


  // filter option TC
  private _filterTaxconditions(description: string): any[] {
    const filterValue = description.toLowerCase();
    return this.taxconditions.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayDoctype(doctype: any): string {
    return doctype && doctype.description ? doctype.description : '';
  }
  displayTaxCondition(taxc: any): string {
    return taxc && taxc.description ? taxc.description : '';
  }




  async getDocTypes() {
    try {
      this.doctypes = await lastValueFrom(this.doctypeService.getAll());

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }
  async getTaxcondition() {
    try {
      this.taxconditions = await lastValueFrom(this.taxconditionService.getAll());

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: 'Add', data: this.local_data });
    //add save functions
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}