import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { lastValueFrom } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Estimate } from 'src/app/models/estimate';
import { Invoice } from 'src/app/models/invoice';
import { EstimateService } from 'src/app/services/estimate.service';

@Component({
  selector: 'app-estimate-list',
  standalone: true,
  imports: [CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    TranslateModule,
    RouterModule],
  templateUrl: './estimate-list.component.html'
})
export class EstimateListComponent implements AfterViewInit {

  estimates: Estimate[] = [];



  allComplete: boolean = false;

  list: MatTableDataSource<Estimate>;
  displayedColumns: string[] = [
    'chk',
    'id',
    'contact',
    'sucursal',
    'imp_total', 
    'sent_mail',
    'action',
  ];

  @ViewChild(MatSort) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator) paginator: MatPaginator = Object.create(null);

  constructor(
    private estimateService: EstimateService
  ) {

    console.log('ingresa');
    this.getItems();
   
  }

  ngAfterViewInit(): void {
    this.list.paginator = this.paginator;
    this.list.sort = this.sort;
  }

  async getItems() {
    try {
      this.estimates = await lastValueFrom(this.estimateService.getAll());
      console.log(this.estimates);
      this.list = new MatTableDataSource(this.estimates);

    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateAllComplete(): void {
    this.allComplete =
      this.list != null &&
      this.list.data.every((t) => t.sent_mail);
  }
  someComplete(): any {
    return (
      this.list.data.filter((t) => t.sent_mail).length > 0 &&
      !this.allComplete
    );
  }
  setAll(completed: boolean): void {
    this.allComplete = completed;
    this.list.data.forEach((t) => (t.draft = completed));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  filter(filterValue: string): void {
    this.list.filter = filterValue.trim().toLowerCase();
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteItem(row: number): void {
    if (confirm('Are you sure you want to delete this record ?')) {
      this.estimateService.delete(row);
      this.list.data = this.list.data.filter(
        (invoice) => invoice.id !== row
      );
    }
  }


}
