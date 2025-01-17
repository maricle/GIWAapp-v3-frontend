import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { lastValueFrom } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Address } from 'src/app/models/address';
import { Contact } from 'src/app/models/contact';
import { ContactList } from 'src/app/models/contactList';
import { Doctype } from 'src/app/models/doctype';
import { Taxcondition } from 'src/app/models/taxcondition';
import { ContactService } from 'src/app/services/contact.service';
import { DoctypeService } from 'src/app/services/doctype.service';
import { TaxconditionService } from 'src/app/services/taxcondition.service';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.scss'
})
export class ContactEditComponent implements OnInit {
  contactform: FormGroup; 
  data: Contact;
  doctypes: Doctype[] = [];
  taxconditions: Taxcondition[] = [];
  id: any;


  constructor(
    private fb: FormBuilder,
    private doctypeService: DoctypeService,
    private taxconditionService: TaxconditionService,
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) {
    this.getDocTypes();
    this.getTaxcondition();

    this.id = this.activatedRoute.snapshot.params['id'];




    this.contactform = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      razon_social: [''],
      cellphone: [''],
      doc_number: ['', Validators.required],
      designer: [''],
      enable: ['', Validators.required],
      supplier: [false],
      tax_condition: [5],
      doc_type: [96],
      addresses: this.fb.array([])
    });


  }

  ngOnInit(): void {
    if (this.id) {

      this.contactService.getById(this.id).subscribe((data: any) => {
        this.data = data;
        this.loadContact(data);
      });
    } else {
      this.contactform.patchValue({
        doc_type: 96,
        tax_condition: 5, 
      });
    }
  }


  // Get Doctypes
  async getDocTypes() {
    try {
      this.doctypes = await lastValueFrom(this.doctypeService.getAll());

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  // Get Taxconditions
  async getTaxcondition() {
    try {
      this.taxconditions = await lastValueFrom(this.taxconditionService.getAll());

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  get addresses() {
    return this.contactform.get('addresses') as FormArray;
  }

  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      street: [''],
      number: [''],
      province: [''],
      city: [''],
      postal_code: [''],
      default: [false]
    });
  }

  addAddress() {
    this.addresses.push(this.createAddressFormGroup());
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  loadContact(data: ContactList) {
    this.contactform.patchValue(data);

    // Clear existing addresses
    while (this.addresses.length) {
      this.addresses.removeAt(0);
    }

    // Add addresses from data
    if (data.addresses && Array.isArray(data.addresses)) {
      data.addresses.forEach(address => {
        this.addresses.push(this.fb.group(address));
      });
    }

    // If no addresses exist, add at least one empty address form
    if (this.addresses.length === 0) {
      this.addAddress();
    }
  }



  async saveDetail() {
    if (this.contactform.valid) {
      try {
        const formData = this.contactform.value;

        if (this.data?.id) {
          // Update existing contact
          formData.addresses = [];
          await lastValueFrom(this.contactService.update(this.data.id, formData));
        } else {
          // Create new contact
          await lastValueFrom(this.contactService.create(formData));
        }
        this.router.navigate(['/apps/contacts']);
      } catch (error) {
        console.error('Error saving contact:', error);
      }
    }
  }


}
