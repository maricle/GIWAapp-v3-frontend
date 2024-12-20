import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog.component';
import { OkAppTaskComponent } from './ok-task/ok-task.component';
import { DeleteAppTaskComponent } from './delete-task/delete-task.component';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order';
import { StatusService } from 'src/app/services/status.service';
import { Status } from 'src/app/models/status';
import { order } from '../invoice/invoice';

// tslint:disable-next-line - Disables all
interface todos {
  id: number;
  title: string;
  description: string;
  class?: string;
}

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, DragDropModule],
})
export class AppTaskboardComponent  implements OnInit{

  orders:Order[]=[];
  statuslist:Status[]=[];
  new: Order[] = [];
  design: Order[] = [] ;
  inprossess: Order[] = [] ;
  completed: Order[] = [];
  packaging: Order[] = [];

  constructor(public dialog: MatDialog,
    public ordersService: OrderService,
    public statusService: StatusService

  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStatus();
      
  }
  async loadOrders() {

    try {
      console.log('entra init');
      this.orders = await this.ordersService.getAllContacts();
      this.new = this.getBystatus(1);
      this.design = this.getBystatus(2);
      this.inprossess = this.getBystatus(3); 
      this.completed = this.getBystatus(4);
     
    } catch (error) {
      console.error('Error fetching orders', error);
    }

  }
  async loadStatus(){
    this.statuslist = await this.statusService.getAllvalues();

  }


  getBystatus(val: number) {
    return this.orders.filter((m: any) => m.status == val);
  }


  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // this.saveData(event.containesr.data);
      console.log(' must update status', event.container);
      this.saveData(event.container.data, event.container.id );
    }
  }


  async saveData(data: Order[], idlist: string) {
    const data_tochange = data.filter(m => m.status_desc !== idlist) as Order[];
    const newstatus = this.statuslist.find(m => m.name === idlist);
    
    if (!newstatus) {
      console.error('New status not found');
      return;
    }
  
    // Usamos Promise.all para ejecutar todas las actualizaciones en paralelo
    const updatePromises = data_tochange
      .filter(val => val.id !== undefined)  // Filtra solo los elementos con `id` definido
      .map(async (val) => {
        val.status = newstatus.id as number;
        return this.ordersService.update(val.id as number, val);
      });
  
    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating orders:', error);
    }
  }

 
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addTask(result.data);
      }
      if (result.event === 'Edit') {
        this.editTask(result.data);
      }
    });
  }

  addTask(row_obj: any): void {
    // this.todos.push({
    //   id: this.todos.length + 1,
    //   name: row_obj.name,
    //   description: row_obj.description,
    // });
    this.dialog.open(OkAppTaskComponent);
  }

  editTask(row_obj: any): void {
    this.orders = this.orders.filter((value: Order) => {
      if (value.id === row_obj.id) {
        value.name = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });

    this.inprossess = this.inprossess.filter((value: Order) => {
      if (value.id === row_obj.id) {
        value.name = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });
    this.design = this.design.filter((value: Order) => {
      if (value.id === row_obj.id) {
        value.name = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });

    this.completed = this.completed.filter((value: Order) => {
      if (value.id === row_obj.id) {
        value.name = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });
  }

  deleteTask(t: Order) {
    const del = this.dialog.open(DeleteAppTaskComponent);

    del.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.new = this.new.filter((task) => task.id !== t.id);
        this.inprossess = this.inprossess.filter((task) => task.id !== t.id);
        this.design = this.design.filter((task) => task.id !== t.id);
        this.completed = this.completed.filter((task) => task.id !== t.id);
      }
    });
  }


}
