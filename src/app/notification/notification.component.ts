import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {AppError, AppErrorType} from '../shared/shared.model';
import {ObservableMedia} from '@angular/flex-layout';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from './notification.service';
import {MatSnackBar} from '@angular/material';

const INFO_BANNER_DISAPPEAR_AFTER = 3000;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  showError = false;
  error: AppError;
  error$: Observable<AppError>;
  info$: Observable<string>;
  destroy$ = new Subject<boolean>();
  showDetails = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private notificationService: NotificationService, private snackBar: MatSnackBar) {
    this.error$ = this.notificationService.error$;
    this.info$ = this.notificationService.info$;
  }

  ngOnInit() {
    this.error$.pipe(
      takeUntil(this.destroy$),
      filter(error => !!error),
    ).subscribe(appError => {
      this.showError = true;
      this.error = appError;
    });

    this.info$.pipe(takeUntil(this.destroy$))
      .subscribe(info => {
        if (!info) {
          this.snackBar.dismiss();
        } else {
          this.snackBar.open(info, 'DISMISS', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['notification-info', 'mat-elevation-z5'],
            duration: INFO_BANNER_DISAPPEAR_AFTER
          });
        }
      });
  }

  isHttpError() {
    return this.error && this.error.type === AppErrorType.HTTP_ERROR;
  }

  isTechnicalError() {
    return this.error && this.error.type === AppErrorType.TECHNICAL_ERROR;
  }

  isOfflineError() {
    return this.error && this.error.type === AppErrorType.OFFLINE_ERROR;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
