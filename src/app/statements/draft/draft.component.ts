import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {StatementService} from '../shared/statement.service';
import {Subject} from 'rxjs';
import {StatementDraftTo} from '../../shared/shared.model';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../notification/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit, OnDestroy {

  drafts: StatementDraftTo[] = [];
  @ViewChild('confirmDeleteTemplate')
  confirmDeleteTemplate: TemplateRef<any>;
  destroy$ = new Subject<boolean>();

  constructor(private statementService: StatementService, private dialog: MatDialog,
              private translate: TranslateService, private notificationService: NotificationService,
              private router: Router) {
  }

  ngOnInit() {
    this.retrieveDrafts();
  }

  private retrieveDrafts(): void {
    this.statementService.retrieveDrafts().pipe(takeUntil(this.destroy$))
      .subscribe(drafts => this.drafts = drafts);
  }

  countDuplicates(transactions): number {
    return transactions.filter(t => t.duplicate).length;
  }

  openConfirmDeleteDialog(draft: StatementDraftTo) {
    const dialogRef = this.dialog.open(this.confirmDeleteTemplate);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.statementService.deleteDraft(draft.id).pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.translate.get('statements.newStatement.draftDeleted')
              .subscribe(translation => {
                this.retrieveDrafts();
                this.notificationService.displayInfo(translation);
              });
          });

      }
    });
  }

  gotoDraft(draft: StatementDraftTo) {
    this.router.navigate(['statements', 'new-statement'], {queryParams: {draft: draft.id}});
  }

  gotoNewStatement() {
    this.router.navigate(['statements', 'new-statement']);
  }

  trackByFn(index, item) {
    return item.id; // or item.id
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
