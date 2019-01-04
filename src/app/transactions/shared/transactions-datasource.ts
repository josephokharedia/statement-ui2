import {DataSource} from '@angular/cdk/table';
import {Transaction, TransactionResult} from '../../shared/shared.model';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {TransactionsService} from './transactions.service';
import {NotificationService} from '../../notification/notification.service';

export class TransactionsDatasource extends DataSource<Transaction> {

  private transactionSubject = new BehaviorSubject<Transaction[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private transactionSizeSubject = new BehaviorSubject<number>(0);
  transactionSize$ = this.transactionSizeSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private transactionsService: TransactionsService,
              private notificationService: NotificationService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Transaction[]> {
    return this.transactionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.transactionSubject.complete();
    this.loadingSubject.complete();
  }

  getTransactions(search, categoryIds, institutions, fromDate: Date, toDate: Date,
                  sortField: string, sortDirection: string, pageIndex = 0, pageSize = 10) {
    return this.transactionsService.retrieve(search, categoryIds, institutions, fromDate, toDate,
      sortField, sortDirection, pageIndex, pageSize)
      .subscribe((transactionResult: TransactionResult) => {
        this.transactionSubject.next(transactionResult.data);
        this.transactionSizeSubject.next(transactionResult.count);
      });

  }

}
