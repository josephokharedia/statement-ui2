import {Injectable, OnDestroy} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, share, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnDestroy {

  handset$: Observable<boolean>;
  tablet$: Observable<boolean>;
  web$: Observable<boolean>;

  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  destroy$ = new Subject<boolean>();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.handset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches), share());
    this.tablet$ = this.breakpointObserver.observe([Breakpoints.Tablet])
      .pipe(map(result => result.matches), share());
    this.web$ = this.breakpointObserver.observe([Breakpoints.Web])
      .pipe(map(result => result.matches), share());

    this.handset$.pipe(takeUntil(this.destroy$)).subscribe(result => this.isHandset = result);
    this.tablet$.pipe(takeUntil(this.destroy$)).subscribe(result => this.isTablet = result);
    this.web$.pipe(takeUntil(this.destroy$)).subscribe(result => this.isWeb = result);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
