import {Component, OnDestroy, OnInit} from '@angular/core';
import {ObservableMedia} from '@angular/flex-layout';
import {Observable} from 'rxjs';
import {filter, map, pluck, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NotificationService} from './shared/notification.service';
import {MatSnackBar} from '@angular/material';
import {AppError} from './shared/shared.model';

const ERROR_BANNER_DISAPPEAR_AFTER = 5000;
const INFO_BANNER_DISAPPEAR_AFTER = 3000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


  title = 'Ekugcineni';
  mobileView$: Observable<boolean>;

  subtitle: string;
  error$: Observable<AppError>;
  info$: Observable<string>;
  showError = false;
  opened = true;
  mode: 'side' | 'over' = 'side';

  constructor(private media: ObservableMedia, private router: Router, private activatedRoute: ActivatedRoute,
              private notificationService: NotificationService, private snackBar: MatSnackBar) {
    this.error$ = this.notificationService.error$;
    this.info$ = this.notificationService.info$;
  }

  mouseEnter() {
    this.mode = 'over';
    this.opened = true;
  }
  mouseLeave() {
    this.mode = 'side';
    this.opened = true;
  }

  ngOnInit(): void {
    this.mobileView$ = this.media.asObservable().pipe(map(mc => mc.mqAlias === 'xs'));

    this.error$ = this.error$.pipe(
      filter(error => !!error),
      tap((error) => {
        this.showError = true;
        setTimeout(() => {
          if (error && error.dismissable) {
            this.showError = false;
          }
        }, ERROR_BANNER_DISAPPEAR_AFTER);
      })
    );

    this.info$.pipe(
      tap(info => {
        if (!info) {
          this.snackBar.dismiss();
        } else {
          this.snackBar.open(info, 'DISMISS', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['notification-info', 'mat-elevation-z5'],
            duration: INFO_BANNER_DISAPPEAR_AFTER
          });
        }
      })
    ).subscribe();

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        pluck('snapshot', 'data', 'title'),
      )
      .subscribe(title => this.subtitle = title.toString());
  }

  ngOnDestroy() {
  }

  closeError() {
    this.showError = false;
  }


}
