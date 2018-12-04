import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


const HANDSET_DEVICE_CLASS = 'handsetDevice';
const TABLET_DEVICE_CLASS = 'tabletDevice';
const DESKTOP_DEVICE_CLASS = 'desktopDevice';


const MIN_SMALL_HANDSET = 0;
const MAX_SMALL_HANDSET = 359;
const MIN_MEDIUM_HANDSET = 360;
const MAX_MEDIUM_HANDSET = 399;
const MIN_LARGE_HANDSET = 400;
const MAX_LARGE_HANDSET = 599;
const MIN_SMALL_TABLET = 600;
const MAX_SMALL_TABLET = 719;
const MIN_LARGE_TABLET = 720;
const MAX_LARGE_TABLET = 959;
const MIN_DESKTOP = 960;
const MAX_DESKTOP = 1920;


@Directive({
  selector: '[appDeviceClass]'
})
export class DeviceClassDirective {

  @Input()
  handset: string;
  @Input()
  tablet: string;
  @Input()
  desktop: string;

  constructor(private hostElement: ElementRef, private renderer: Renderer2, private breakpointObserver: BreakpointObserver) {
    this.addDeviceClass();
  }


  private addDeviceClass() {

    // observe handset
    // this.breakpointObserver.observe([`(min-width: ${MIN_SMALL_HANDSET}px)`, `(max-width: ${MAX_LARGE_HANDSET}px)`])
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.renderer.addClass(this.hostElement.nativeElement, this.handset || HANDSET_DEVICE_CLASS);
        } else {
          this.renderer.removeClass(this.hostElement.nativeElement, this.handset || HANDSET_DEVICE_CLASS);
        }
      });


    // observe tablet
    // this.breakpointObserver.observe([`(min-width: ${MIN_SMALL_TABLET}px)`, `(max-width: ${MAX_LARGE_TABLET}px)`])
    this.breakpointObserver.observe([Breakpoints.Tablet])
      .subscribe(result => {
        if (result.matches) {
          this.renderer.addClass(this.hostElement.nativeElement, this.tablet || TABLET_DEVICE_CLASS);
        } else {
          this.renderer.removeClass(this.hostElement.nativeElement, this.tablet || TABLET_DEVICE_CLASS);
        }
      });

    // observe desktop
    // this.breakpointObserver.observe([`(min-width: ${MIN_DESKTOP}px)`, `(max-width: ${MAX_DESKTOP}px)`])
    this.breakpointObserver.observe([Breakpoints.Web])
      .subscribe(result => {
        if (result.matches) {
          this.renderer.addClass(this.hostElement.nativeElement, this.desktop || DESKTOP_DEVICE_CLASS);
        } else {
          this.renderer.removeClass(this.hostElement.nativeElement, this.desktop || DESKTOP_DEVICE_CLASS);
        }
      });
  }
}
