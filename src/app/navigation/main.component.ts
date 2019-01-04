import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
    <main [class.border]="border">
      <ng-content></ng-content>
    </main>`,
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  @Input()
  border = true;
}
