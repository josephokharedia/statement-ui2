import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {TransactionsDatasource} from './shared/transactions-datasource';
import {TransactionsService} from './shared/transactions.service';
import {MatBottomSheet, MatPaginator, MatSort} from '@angular/material';
import {Category} from '../shared/shared.model';
import {NotificationService} from '../shared/notification.service';
import {FilterComponent} from './filter-transactions/filter.component';
import {DeviceService} from '../shared/device.service';

@Component({
  selector: 'e-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {

  startDate: Date;
  endDate: Date = new Date();
  categories: string[] = [];

  readonly displayedColumns: string[] = ['date', 'description', 'amount', 'balance', 'star'];
  @ViewChild('filter', {read: ElementRef})
  filter: ElementRef;
  dataSource: TransactionsDatasource;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(private transactionsService: TransactionsService,
              private notificationService: NotificationService,
              private bottomSheet: MatBottomSheet,
              private device: DeviceService) {
  }

  ngOnInit() {
    this.dataSource =
      new TransactionsDatasource(this.transactionsService, this.notificationService);
  }

  ngAfterViewInit(): void {
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.getTransactions();
        })
      ).subscribe();

    this.paginator.page
      .pipe(tap(() => this.getTransactions()))
      .subscribe();

    this.sort.sortChange
      .pipe(tap(() => {
        this.paginator.pageIndex = 0;
        this.getTransactions();
      })).subscribe();

    this.getTransactions();
  }

  setStartDate(date: Date) {
    this.startDate = date;
    this.paginator.pageIndex = 0;
    this.getTransactions();
  }

  setEndDate(date: Date) {
    this.endDate = date;
    this.paginator.pageIndex = 0;
    this.getTransactions();
  }

  setCategories(categories: string[]) {
    this.categories = categories;
    this.paginator.pageIndex = 0;
    this.getTransactions();
  }

  getTransactions() {
    const sortField = `${this.sort.active}`;
    const sortDirection = `${this.sort.direction}`;

    this.dataSource.getTransactions(
      this.filter.nativeElement.value, this.categories, this.startDate, this.endDate,
      sortField, sortDirection, this.paginator.pageIndex, this.paginator.pageSize);
  }

  normalizeStr(str: string) {
    if (!str) {
      return str;
    }
    return str.toLowerCase().replace(/ /g, '_');
  }

  trackByCategory(idx, itm: Category) {
    return itm._id;
  }

  openFilterDialog() {
    const bottomSheetRef = this.bottomSheet.open(FilterComponent);
    bottomSheetRef.instance.startDate.subscribe(startDate => {
      this.setStartDate(startDate);
    });
    bottomSheetRef.instance.endDate.subscribe(endDate => {
      this.setEndDate(endDate);
    });
    bottomSheetRef.instance.categories.subscribe(categories => {
      this.setCategories(categories);
    });
    // bottomSheetRef.instance.institutions.subscribe(institutions => {
    // this.setInstitutions(institutions);
    // });
  }

  ngOnDestroy() {
  }
}
