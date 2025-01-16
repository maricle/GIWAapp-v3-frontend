import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { ContactList } from 'src/app/models/contactList';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-view',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule, 
    RouterLink,
    FormsModule, 
    ReactiveFormsModule, 
    TablerIconsModule],
  templateUrl: './contact-view.component.html',
  styleUrl: './contact-view.component.scss'
})

export class ContactViewComponent {
  id: any;
  contactDetail: ContactList; 
  orders: any[];
  invoices: any[];

  constructor(activatedRouter: ActivatedRoute,
     private contactService: ContactService) {
    this.id = activatedRouter.snapshot.paramMap.get('id');
    this.contactService.getDetails(this.id).subscribe((data: any) => {
      this.contactDetail = data  ;
      this.orders = data.orders;
      this.invoices = data.invoices;

      console.log(this.contactDetail);
    });
  }
}
