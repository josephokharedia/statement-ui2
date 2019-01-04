import {AfterViewInit, ContentChild, Directive, EventEmitter, HostListener, OnDestroy, OnInit, Optional, Output} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {DeviceService} from '../shared/device.service';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[appSidenavContainer]'
})
export class SidenavContainerDirective implements OnInit, OnDestroy, AfterViewInit {

  @ContentChild(MatSidenav)
  sidenav: MatSidenav;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Output()
  private mini: EventEmitter<boolean> = new EventEmitter();

  constructor(private device: DeviceService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.device.handset$.pipe(filter(_ => _), takeUntil(this.destroy$))
      .subscribe(() => this.setSidenavStateForHandset());
    this.device.tablet$.pipe(filter(_ => _), takeUntil(this.destroy$))
      .subscribe(() => this.setSidenavStateForTablet());
    this.device.web$.pipe(filter(_ => _), takeUntil(this.destroy$))
      .subscribe(() => this.setSidenavStateForWeb());
  }

  toggleSidenav() {
    if (this.device.isTablet && this.sidenav.opened) {
      this.toggleSidenavForTablet();
    } else {
      this.sidenav.toggle();
    }
  }


  private toggleSidenavForTablet() {
    if (this.sidenav.opened) {
      this.sidenav.mode = 'over';
      this.mini.emit(false);

      // Monitor when it is closed again (via clicking backdrop or esc)
      // then re-open it in miniSidenav side mode
      const subscription = this.sidenav.openedChange
        .pipe(filter(o => !o))
        .subscribe(() => {
          this.sidenav.mode = 'side';
          this.mini.emit(true);
          this.sidenav.open()
            .then(() => subscription.unsubscribe());
        });
    }
  }

  private setSidenavStateForHandset() {
    this.sidenav.opened = false;
    this.sidenav.mode = 'over';
    this.mini.emit(false);
  }

  private setSidenavStateForTablet() {
    this.sidenav.opened = true;
    this.sidenav.mode = 'side';
    this.mini.emit(true);
  }

  private setSidenavStateForWeb() {
    this.sidenav.opened = true;
    this.sidenav.mode = 'side';
    this.mini.emit(false);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}

@Directive({
  selector: '[appSidenavToggle]'
})
export class SidenavToggleDirective {

  @HostListener('click', ['$event'])
  onClick() {
    this.sidenavContainer.toggleSidenav();
  }

  constructor(@Optional() private sidenavContainer: SidenavContainerDirective) {
  }
}

