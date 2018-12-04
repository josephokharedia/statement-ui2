import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceService} from '../shared/device.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  private navListContext = {
    $implicit: [
      {name: 'Dashboard', url: '/'},
      {name: 'Transactions', url: '/transactions'},
      {name: 'Statements', url: '/statements'},
    ]
  };

  constructor(private device: DeviceService) {
  }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
