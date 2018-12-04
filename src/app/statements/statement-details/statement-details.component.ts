import {AfterViewInit, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges} from '@angular/core';
import {CategoriesTotal, Statement, StatementDetails} from '../../shared/shared.model';
import {StatementService} from '../shared/statement.service';
import {Subscription} from 'rxjs';
import {CurrencyPipe} from '@angular/common';
import * as moment from 'moment';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {TransactionsService} from '../../transactions/shared/transactions.service';
import {DeviceService} from '../../shared/device.service';

@Component({
  selector: 'app-statement-details',
  templateUrl: './statement-details.component.html',
  styleUrls: ['./statement-details.component.scss'],
  providers: [CurrencyPipe]
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementDetailsComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input()
  statement: Statement;
  statementDetails: StatementDetails;
  categoriesTotal: CategoriesTotal[];
  private statementSubscription: Subscription;
  private categoriesTotalSubscription: Subscription;

  // Chart data
  debitChartData: any[];
  debitChartLabels: any[];
  debitChartOptions: any;
  debitChartColors: any[];

  creditChartData: any[];
  creditChartLabels: any[];
  creditChartOptions: any;
  creditChartColors: any[];

  categoriesChartData: any[];
  categoriesChartLabels: any[];
  categoriesChartOptions: any;
  categoriesChartColors: any[];

  constructor(private statementService: StatementService,
              private transactionsService: TransactionsService,
              private currencyPipe: CurrencyPipe,
              private device: DeviceService,
              @Optional() private bottomSheetRef: MatBottomSheetRef<StatementDetailsComponent>,
              @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private data: any
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.bottomSheetRef) {
      console.log(this.bottomSheetRef);
      const statementId = this.data;
      this.statementSubscription = this.statementService.retrieveDetails(statementId)
        .subscribe(sDtls => {
          this.statementDetails = sDtls;
          this.plotDebitsChart();
          this.plotCreditsChart();
        });
      this.categoriesTotalSubscription = this.transactionsService.aggregateCategoriesForStatement(statementId)
        .subscribe(cTotals => {
          this.categoriesTotal = cTotals;
          this.plotCategoriesTotalChart();
        });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.bottomSheetRef) {
      return;
    }
    const stmt = simpleChanges.statement.currentValue;
    this.statementSubscription = this.statementService.retrieveDetails(stmt.id)
      .subscribe(sDtls => {
        this.statementDetails = sDtls;
        this.plotDebitsChart();
        this.plotCreditsChart();
      });
    this.categoriesTotalSubscription = this.transactionsService.aggregateCategoriesForStatement(stmt.id)
      .subscribe(cTotals => {
        this.categoriesTotal = cTotals;
        this.plotCategoriesTotalChart();
      });
  }

  ngOnDestroy() {
    this.statementSubscription.unsubscribe();
    this.categoriesTotalSubscription.unsubscribe();
  }

  private plotDebitsChart() {
    const amounts = [];
    const labels = [];
    const debits = this.statementDetails.transactions.debits.slice(0);
    debits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    debits.forEach(debit => {
      const date = new Date(debit.date);
      labels.push(`${date.getDate()}`);
      amounts.push(Math.abs(debit.amount));
    });


    this.debitChartOptions = {
      responsive: true,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            const debit = debits[tooltipItem.index];
            const formattedAmount = this.currencyPipe.transform(debit.amount, 'ZAR', true, '2.2-4');
            const formattedDate = moment(debit.date.toString()).format('Do MMM YYYY');
            return [formattedDate, debit.description, formattedAmount];
          }
        }
      }
    };
    this.debitChartData = [{data: amounts, label: 'Debits'}];
    this.debitChartColors = [{
      backgroundColor: '#FFAB91',
      borderColor: '#FF5722',
      pointBackgroundColor: '#FF5722',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#FF5722'
    }];

    // This is a bug in ng2-charts. The labels do not get updated in the same tick.
    // For some reason you'll have to render the labels in a different tick to reflect
    setTimeout(() => this.debitChartLabels = labels);
  }

  private plotCreditsChart() {
    const amounts = [];
    const labels = [];
    const credits = this.statementDetails.transactions.credits.slice(0);
    credits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    credits.forEach(credit => {
      const date = new Date(credit.date);
      labels.push(`${date.getDate()}`);
      amounts.push(credit.amount);
    });


    this.creditChartOptions = {
      responsive: true,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            const credit = credits[tooltipItem.index];
            const formattedAmount = this.currencyPipe.transform(credit.amount, 'ZAR', true, '2.2-4');
            const formattedDate = moment(credit.date.toString()).format('Do MMM YYYY');
            return [formattedDate, credit.description, formattedAmount];
          }
        }
      }
    };
    this.creditChartData = [{data: amounts, label: 'Credits'}];
    this.creditChartColors = [{
      backgroundColor: '#B39DDB',
      borderColor: '#512DA8',
      pointBackgroundColor: '#512DA8',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#512DA8'
    }];

    // This is a bug in ng2-charts. The labels do not get updated in the same tick.
    // For some reason you'll have to render the labels in a different tick to reflect
    setTimeout(() => this.creditChartLabels = labels);
  }

  private plotCategoriesTotalChart() {
    const labels = [];
    const amounts = [];
    const categories = this.categoriesTotal.slice(0);
    categories.sort((a, b) => a.amount - b.amount);
    categories.forEach(category => {
      labels.push(category.name);
      amounts.push(category.amount);
    });

    this.categoriesChartOptions = {
      responsive: true,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            const category = categories[tooltipItem.index];
            const formattedAmount = this.currencyPipe.transform(category.amount, 'ZAR', true, '2.2-4');
            return [category.name, category.count + 'X', formattedAmount];
          }
        }
      }
    };
    this.categoriesChartData = [{data: amounts, label: 'Categories'}];
    this.categoriesChartColors = [{
      backgroundColor: '#B39DDB',
      borderColor: '#512DA8',
      pointBackgroundColor: '#512DA8',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#512DA8'
    }];

    // This is a bug in ng2-charts. The labels do not get updated in the same tick.
    // For some reason you'll have to render the labels in a different tick to reflect
    setTimeout(() => this.categoriesChartLabels = labels);
  }

  dismiss() {
    this.bottomSheetRef.dismiss();
  }

}
