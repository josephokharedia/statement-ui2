import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, Renderer2, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MAT_BOTTOM_SHEET_DATA, MAT_DIALOG_DATA, MatBottomSheetRef, MatChipInputEvent, MatDialogRef} from '@angular/material';
import {Category} from '../../shared/shared.model';
import {BehaviorSubject, fromEvent, Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, switchMap, takeWhile} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {CategoryService} from '../shared/category.service';
import {DeviceService} from '../../shared/device.service';
import {TransactionsService} from '../../transactions/shared/transactions.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category-dialog.component.html',
  styleUrls: ['./manage-category-dialog.component.scss']
})
export class ManageCategoryDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('tagInput', {read: ElementRef})
  tagInput: ElementRef;

  action = Action.ADD;
  category: Category;
  ActionType = Action;
  categoryForm: FormGroup;
  private active = true;

  private allowSubmitSubject = new BehaviorSubject<boolean>(false);
  allowSubmit$ = this.allowSubmitSubject.asObservable();
  private suggestionsSubject = new BehaviorSubject<string[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();
  mobileView$: Observable<boolean>;

  constructor(@Optional() private dialogRef: MatDialogRef<ManageCategoryDialogComponent>,
              @Optional() private bottomSheetRef: MatBottomSheetRef<ManageCategoryDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: DialogData,
              @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private bottomSheetData: DialogData,
              private formBuilder: FormBuilder,
              private breakpointObserver: BreakpointObserver,
              private categoryService: CategoryService,
              private device: DeviceService,
              private transactionService: TransactionsService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    const data = this.dialogData || this.bottomSheetData;
    this.category = data && data.category || {};
    this.action = data && Action[data.action] || Action.ADD;

    if (this.action === Action.ADD) {
      this.category = {name: '', tags: []};
    }

    if (this.action === Action.EDIT) {
      this.category = Object.assign({}, data.category);
      this.category.tags = data.category.tags.slice(0);
    }

    this.categoryForm = this.formBuilder.group({
      name: this.category.name,
      tags: [this.category.tags]
    });

    this.categoryForm.get('name').valueChanges
      .pipe(
        takeWhile(() => this.active),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe(value => {
        this.category.name = value;
        this.allowSubmitSubject.next(this.category.name && !!this.category.tags.length);
      });

    this.categoryForm.get('tags').valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe(() => {
        this.allowSubmitSubject.next(this.category.name && !!this.category.tags.length);
      });

    this.allowSubmitSubject.next(this.category.name && !!this.category.tags.length);
  }

  ngAfterViewInit() {
    if (this.action === Action.DELETE) {
      return;
    }
    fromEvent(this.tagInput.nativeElement, 'keyup')
      .pipe(
        takeWhile(() => this.active),
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => this.tagInput.nativeElement.value),
        switchMap(() => this.transactionService.searchDescription(this.tagInput.nativeElement.value)),
      )
      .subscribe(suggestions => {
        if (suggestions) {
          this.suggestionsSubject.next(suggestions);
        }
      });
  }


  submit(category: Category) {
    if (this.dialogRef) {
      this.dialogRef.close(category);
    }
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss(category);
    }
  }

  removeTagFromCategory(tag) {
    const index = this.category.tags.indexOf(tag);
    if (index >= 0) {
      this.category.tags.splice(index, 1);
      this.categoryForm.get('tags').setValue(!!this.category.tags.length ? this.category.tags : null);
    }
  }

  addTagToCategory(event: MatChipInputEvent | string): void {
    if (typeof (event) === 'string') {
      this.renderer.setProperty(this.tagInput.nativeElement, 'value', event);
      this.suggestionsSubject.next([]);
      return;
    }
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.category.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.categoryForm.get('tags').setValue(this.category.tags);
    this.suggestionsSubject.next([]);
  }

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }


  ngOnDestroy(): void {
    this.active = false;
  }
}

interface DialogData {
  action: string;
  category: Category;
}


enum Action {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}
