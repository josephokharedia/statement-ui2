import {Component} from '@angular/core';
import {DeviceService} from '../shared/device.service';

@Component({
  selector: 'app-sidenav-toggle',
  template: `
    <button *ngIf="!device.isWeb" appSidenavToggle mat-icon-button class="app-margin-right-16">
      <mat-icon>menu</mat-icon>
    </button>`,
  styleUrls: []
})
export class SidenavToggleComponent {

  constructor(private device: DeviceService) {

  }
}
