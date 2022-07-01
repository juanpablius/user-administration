import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import { Action } from 'src/app/core/interfaces/pop-up';



import {
  DeletePopupInput,
  DeletePopupOutput,
  DeleteTablePopupComponent,
} from './pop-ups/delete-item.component';


export interface TableHeaders {
  // Name of the property as on the database
  name: string;
  // Title shown in the table
  displayName: string;
  // Defines some types for piping the output
}


@Component({
  selector: 'jp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements  OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator)
  protected paginator: MatPaginator;

  @Input()  // Optional
  public title: string;

  /**
   * Each of the rows, i.e: ["Fire", 1, false];
   * ATENTION: We type 'any' as this table doesn't know the shape of the items
   * that will be recieved.
   *
   * Set is used to synchronize the input received with _updatedSource. Needed for the filters
   */
  @Input()
  public set dataSource(newValue) {
    if (newValue === this._updatedSource) {
      return;
    }
    this._dataSource = new MatTableDataSource(newValue);
    this._updatedSource = newValue;
    this._dataSource.sort = this.sort;
    this._dataSource.paginator = this.paginator;

  }
  public get dataSource(): any {
    return this._dataSource;
  }

 
  @Input()
  public set columns(newValue) {
    if (newValue === this._columns) {
      return;
    }
    const cols = newValue;
    this._recievedLabels = cols.map((column: TableHeaders) => column.name);
    this.headersFilters = cols.map((column: TableHeaders) => column);
    this.columnLabels = ['action'];
    this.headersFilters.push({displayName: 'workAround', name: 's'});
    this.columnLabels = this._recievedLabels.concat(this.columnLabels);
    this._columns = newValue;
  }
  public get columns(): any {
    return this._columns;
  }


  @Output()
  public deletedRow = new EventEmitter<any>();


  @Output()
  public updatedRow = new EventEmitter<any>();

  @Output()
  public createdRow = new EventEmitter<any>();

  @ViewChild(MatSort)
  protected sort: MatSort;

  public columnLabels: string[];
  public headersFilters: TableHeaders[];
  public headersFilterName: string[];

  // Inputs for the plain string filters
  public tableFormControls: FormControl[];

  // Inputs for the Date object;
  // each form group will have this two properties
  // {startDate, endDate}
  public dateFormGroup: FormGroup[];

  // Source displayed on the table, it can be modified by the internal filters
  public _dataSource: any;
  private _columns: any;

  public showFirstLastButtonsOfPaginator = true;
  public showTable = true;

  private _destroyed$ = new Subject();
  protected _recievedLabels: string[];

  // Static source within the component
  private _updatedSource: any;

  // Object that'll have the filters
  protected _filterValues = {};

  public constructor(
      protected readonly paginators: MatPaginatorIntl,
      protected readonly _dialog: MatDialog,
  ) {

  }

  public ngOnDestroy(): void {
    this._destroyed$.next({});
    this._destroyed$.complete();
  }

  public ngAfterViewInit(): void {
    if (this._dataSource?.length) {
      this._dataSource.paginator = this.paginator;
    }
  }

  public createRow(): void {
    this.createdRow.emit();
  }

  public deleteRow(row: any): void {
    const deleteRowInput: DeletePopupInput = {
      action: Action.delete,
      headerMessage: 'Are you sure you want to delete this item?',
      item: row,
      keys: this._recievedLabels,
      labels: this.columns.map((column: TableHeaders) => column.displayName),
    };

    const dialogRef = this._dialog.open(DeleteTablePopupComponent, {
      width: '500px',
      data: deleteRowInput,
    });

    dialogRef.afterClosed().pipe(filter((result: DeletePopupOutput) => result.event === Action.delete)).subscribe(() => {
      this.deletedRow.emit(row);
    });
  }

  public updateRow(row: any): void {
    this.updatedRow.emit(row);
  }
}
