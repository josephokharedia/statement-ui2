import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header>
      <ng-content></ng-content>
      <app-notification></app-notification>
    </header>`,
  styles: [
      `header {
      position: sticky;
      top: 0;
      z-index: 3;
    }`]
})
export class HeaderComponent {

}
