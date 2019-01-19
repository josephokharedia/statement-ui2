import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DeviceService} from '../../shared/device.service';
import {StatementDraftTo, StatementTo, StatementTransaction} from '../../shared/shared.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InstitutionService} from '../../shared/institution.service';
import {StatementService} from '../shared/statement.service';
import {MatDialog, MatStepper} from '@angular/material';
import {NotificationService} from '../../notification/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-new-statement',
  templateUrl: './new-statement.component.html',
  styleUrls: ['./new-statement.component.scss']
})
export class NewStatementComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<boolean>();
  draft: StatementDraftTo;
  formArray: FormArray;
  institutions$: Observable<string[]>;
  createdStatement: StatementTo;
  @ViewChild('confirmDeleteTemplate')
  confirmDeleteTemplate: TemplateRef<any>;
  @ViewChild(MatStepper)
  stepper: MatStepper;
  showAllTransactions = false;

  constructor(private device: DeviceService, private route: ActivatedRoute,
              private fb: FormBuilder, private institutionService: InstitutionService,
              private statementService: StatementService, private router: Router,
              private dialog: MatDialog, private notificationService: NotificationService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$))
      .subscribe(d => {
        if (d && d['draft']) {
          this.draft = d['draft'];
          setTimeout(() => this.fileFormControl.setValue({name: this.draft.filename}));
        }
      });

    this.institutions$ = this.institutionService.retrieve().pipe(map(x => x.map(_x => _x.name)));

    this.formArray = this.fb.array([
      this.fb.group({
        institution: this.fb.control(this.draft && this.draft.institution.toUpperCase() || null, Validators.required),
        file: this.fb.control(null, Validators.required),
      }),
    ]);
  }

  get editMode(): boolean {
    return !!this.draft;
  }

  get doneMode(): boolean {
    return !!this.createdStatement;
  }

  get transactions(): StatementTransaction[] {
    if (this.showAllTransactions) {
      return this.draft.transactions;
    } else {
      return this.draft.transactions.slice(0, 2);
    }
  }

  back() {
    if (this.editMode && !this.doneMode) {
      this.translate.get('statements.newStatement.draftSaved')
        .subscribe(translation => {
          this.notificationService.displayInfo(translation);
          this.router.navigate(['statements']);
        });
    } else {
      this.router.navigate(['statements']);
    }
  }


  get selectedInstitution(): string {
    return this.institutionFormControl.value;
  }

  set selectedInstitution(institution: string) {
    if (!this.editMode) {
      this.institutionFormControl.setValue(institution);
    }
  }

  get step1FormGroup(): FormGroup {
    return this.formArray.get([0]) as FormGroup;
  }

  get fileFormControl(): FormControl {
    return this.step1FormGroup.get('file') as FormControl;
  }

  get institutionFormControl(): FormControl {
    return this.step1FormGroup.get(['institution']) as FormControl;
  }

  clearFile() {
    this.fileFormControl.setValue(null);
  }

  onFileChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileFormControl.setValue(files[0]);
    }
  }

  createDraft() {
    if (this.step1FormGroup.valid) {
      const institution = this.institutionFormControl.value;
      const file = this.fileFormControl.value;
      this.statementService.createDraft(institution, file).pipe(takeUntil(this.destroy$))
        .subscribe(r => {
          this.draft = r;
          setTimeout(() => this.stepper.next(), 0);
        });
    }
  }

  approveDraft() {
    this.statementService.approveDraft(this.draft.id).pipe(takeUntil(this.destroy$))
      .subscribe(r => {
        this.createdStatement = r;
        setTimeout(() => {
          this.stepper.next();
          this.translate.get('statements.newStatement.statementCreated')
            .subscribe(translation => {
              this.notificationService.displayInfo(translation);
            });
        }, 0);
      });
  }

  openConfirmDeleteDialog() {
    const dialogRef = this.dialog.open(this.confirmDeleteTemplate);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.statementService.deleteDraft(this.draft.id).pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.translate.get('statements.newStatement.draftDeleted')
              .subscribe(translation => {
                this.notificationService.displayInfo(translation);
                this.router.navigate(['statements']);
              });
          });

      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
