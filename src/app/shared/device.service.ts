import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, share} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  handset$: Observable<boolean>;
  tablet$: Observable<boolean>;
  web$: Observable<boolean>;

  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.handset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches), share());
    this.tablet$ = this.breakpointObserver.observe([Breakpoints.Tablet])
      .pipe(map(result => result.matches), share());
    this.web$ = this.breakpointObserver.observe([Breakpoints.Web])
      .pipe(map(result => result.matches), share());

    this.handset$.subscribe(result => this.isHandset = result);
    this.tablet$.subscribe(result => this.isTablet = result);
    this.web$.subscribe(result => this.isWeb = result);
  }
}
