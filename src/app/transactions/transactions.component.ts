import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil, tap} from 'rxjs/operators';
import {TransactionsDatasource} from './shared/transactions-datasource';
import {TransactionsService} from './shared/transactions.service';
import {MatBottomSheet, MatDrawer, MatPaginator, MatSort} from '@angular/material';
import {Category} from '../shared/shared.model';
import {NotificationService} from '../notification/notification.service';
import {FilterComponent} from './filter-transactions/filter.component';
import {DeviceService} from '../shared/device.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {

  startDate: Date;
  endDate: Date = new Date();
  categories: string[] = [];
  institutions: string[] = [];

  readonly displayedColumns: string[] = ['date', 'description', 'amount', 'balance', 'star'];
  @ViewChild('filter', {read: ElementRef})
  filter: ElementRef;
  dataSource: TransactionsDatasource;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatDrawer)
  drawer: MatDrawer;
  showSearchBar = false;
  destroy$ = new Subject<boolean>();
  private searchTerm$ = new BehaviorSubject<string>('');
  editMode = false;

  constructor(private transactionsService: TransactionsService,
              private notificationService: NotificationService,
              private bottomSheet: MatBottomSheet,
              private device: DeviceService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.dataSource =
      new TransactionsDatasource(this.transactionsService, this.notificationService);
  }

  ngAfterViewInit(): void {
    this.searchTerm$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.getTransactions();
        })
      ).subscribe();


    this.paginator.page
      .pipe(takeUntil(this.destroy$), tap(() => this.getTransactions()))
      .subscribe();

    this.sort.sortChange
      .pipe(takeUntil(this.destroy$), tap(() => {
        this.paginator.pageIndex = 0;
        this.getTransactions();
      })).subscribe();

    this.getTransactions();
  }

  get searchTerm(): string {
    return this.searchTerm$.getValue();
  }

  set searchTerm(term: string) {
    this.searchTerm$.next(term);
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

  setInstitutions(institutions: string[]) {
    this.institutions = institutions;
    this.paginator.pageIndex = 0;
    this.getTransactions();
  }

  getTransactions() {
    const sortField = `${this.sort.active}`;
    const sortDirection = `${this.sort.direction}`;

    this.dataSource.getTransactions(
      this.searchTerm$.getValue(), this.categories, this.institutions, this.startDate, this.endDate,
      sortField, sortDirection, this.paginator.pageIndex, this.paginator.pageSize);
  }

  normalizeStr(str: string) {
    if (!str) {
      return str;
    }
    return str.toLowerCase().replace(/ /g, '_');
  }

  trackByCategory(idx, itm: Category) {
    return itm.id;
  }

  closeSearchToolbar() {
    this.searchTerm = '';
    this.showSearchBar = false;
  }

  openFilterDialog() {
    if (this.device.isHandset) {
      const bottomSheetRef = this.bottomSheet.open(FilterComponent);
      bottomSheetRef.instance.startDate.pipe(takeUntil(this.destroy$)).subscribe(startDate => {
        this.setStartDate(startDate);
      });
      bottomSheetRef.instance.endDate.pipe(takeUntil(this.destroy$)).subscribe(endDate => {
        this.setEndDate(endDate);
      });
      bottomSheetRef.instance.categories.pipe(takeUntil(this.destroy$)).subscribe(categories => {
        this.setCategories(categories);
      });
      bottomSheetRef.instance.institutions.pipe(takeUntil(this.destroy$)).subscribe(institutions => {
      this.setInstitutions(institutions);
      });
    } else {
      this.drawer.toggle();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
