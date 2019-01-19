import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoResultsComponent implements OnInit, OnDestroy, OnChanges {

  private defaultTitle: string;
  private defaultMessage: string;
  @Input()
  title: string;
  @Input()
  message: string;
  @Input()
  actionText: string;
  @Input()
  actionStyleRaised = true;
  @Output()
  actionClicked: EventEmitter<any> = new EventEmitter<any>();

  private destroy$ = new Subject<boolean>();

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.translate.get('noResults.defaultTitle').pipe(takeUntil(this.destroy$))
      .subscribe(translation => this.defaultTitle = translation);
    this.translate.get('noResults.defaultMessage').pipe(takeUntil(this.destroy$))
      .subscribe(translation => this.defaultMessage = translation);
  }

  get showActionButton(): boolean {
    return this.actionText && this.actionText.trim().length > 0;
  }

  raiseActionClickedEvent(event) {
    this.actionClicked.emit(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const title = (changes['title'] && changes['title'].currentValue) || '';
    const message = (changes['message'] && changes['message'].currentValue) || '';
    if (!title.trim().length) {
      this.title = this.defaultTitle;
    }
    if (!message.trim().length) {
      this.message = this.defaultMessage;
    }
  }


}
