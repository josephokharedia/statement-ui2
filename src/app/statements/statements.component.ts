import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatementService} from './shared/statement.service';
import {StatementTo} from '../shared/shared.model';
import {Subject} from 'rxjs';
import {MatBottomSheet, MatDrawer} from '@angular/material';
import {StatementDetailsComponent} from './statement-details/statement-details.component';
import {DeviceService} from '../shared/device.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-statement',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit, OnDestroy {

  statements: StatementTo[] = [];
  private allStatements: StatementTo[] = [];
  private destroy$ = new Subject<boolean>();

  years: number[] = [];
  selectedYear: number;
  selectedStatement: StatementTo;

  @ViewChild(MatDrawer)
  drawer: MatDrawer;

  constructor(private device: DeviceService,
              private statementService: StatementService,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.retrieveStatements();
  }

  retrieveStatements(): void {
    this.statementService.retrieve().pipe(takeUntil(this.destroy$))
      .subscribe(statements => {
        this.years = this._getYearsFromStatements(statements);
        this.allStatements = statements;
        this.filterStatementsByYear();
      });
  }

  filterStatementsByYear() {
    if (!this.selectedYear && this.years.length) {
      this.selectedYear = this.years[0];
    }

    let filteredStatements = this.allStatements;
    if (this.selectedYear) {
      filteredStatements = this.allStatements.filter(statement => {
        return new Date(statement.fromDate).getFullYear() === this.selectedYear
          || new Date(statement.toDate).getFullYear() === this.selectedYear;
      });
    }

    if (filteredStatements.length) {
      this.selectedStatement = filteredStatements[0];
    }

    this.statements = filteredStatements;
  }

  private _getYearsFromStatements(statements: StatementTo[]): number[] {
    statements.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());
    const yearsFromStatements = new Set<number>();
    statements.forEach(statement => {
      yearsFromStatements.add(new Date(statement.fromDate).getFullYear());
      yearsFromStatements.add(new Date(statement.toDate).getFullYear());
    });
    return Array.from(yearsFromStatements).sort((a, b) => b - a);
  }


  selectStatement(statement: StatementTo) {
    this.selectedStatement = statement;

    if (this.device.isHandset) {
      this.openStatementDetailsBottomSheet();
    }

    if (this.device.isTablet) {
      this._openDrawer();
    }
  }

  private openStatementDetailsBottomSheet() {
    this.bottomSheet.open(StatementDetailsComponent, {
      data: this.selectedStatement.id,
    });
  }

  private _openDrawer() {
    this.drawer.open();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
