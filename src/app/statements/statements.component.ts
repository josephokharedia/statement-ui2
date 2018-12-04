import {Component, OnInit, ViewChild} from '@angular/core';
import {StatementService} from './shared/statement.service';
import {Statement} from '../shared/shared.model';
import {BehaviorSubject} from 'rxjs';
import {MatBottomSheet, MatDialog, MatDrawer} from '@angular/material';
import {StatementDetailsComponent} from './statement-details/statement-details.component';
import {UploadStatementDialogComponent} from './upload-statement/upload-statement-dialog.component';
import {DeviceService} from '../shared/device.service';

@Component({
  selector: 'app-statement',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  private statementsSubject = new BehaviorSubject<Statement[]>([]);
  statements$ = this.statementsSubject.asObservable();
  private allStatements: Statement[] = [];

  years: number[] = [];
  selectedYear: number;
  selectedStatement: Statement;

  @ViewChild(MatDrawer)
  drawer: MatDrawer;

  constructor(private device: DeviceService,
              private statementService: StatementService,
              private bottomSheet: MatBottomSheet,
              private dialog: MatDialog) {
  }

  // TODO: Unsubscribe
  ngOnInit() {
    this.statementService.retrieve()
      .subscribe(statements => {
        this.statementsSubject.next(statements);
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

    this.statementsSubject.next(filteredStatements);
  }

  private _getYearsFromStatements(statements: Statement[]): number[] {
    statements.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());
    const yearsFromStatements = new Set<number>();
    statements.forEach(statement => {
      yearsFromStatements.add(new Date(statement.fromDate).getFullYear());
      yearsFromStatements.add(new Date(statement.toDate).getFullYear());
    });
    return Array.from(yearsFromStatements).sort((a, b) => b - a);
  }


  selectStatement(statement: Statement) {
    this.selectedStatement = statement;

    if (this.device.isHandset) {
      this.openStatementDetailsBottomSheet();
    }

    if (this.device.isTablet) {
      this._openDrawer();
    }
  }

  openUploadStatementDialog() {
    this.dialog.open(UploadStatementDialogComponent, {});
  }

  private openStatementDetailsBottomSheet() {
    this.bottomSheet.open(StatementDetailsComponent, {
      data: this.selectedStatement.id,
    });
  }

  private _openDrawer() {
    this.drawer.open();
  }
}
