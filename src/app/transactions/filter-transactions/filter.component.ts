import {Component, EventEmitter, OnDestroy, OnInit, Optional, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Category} from '../../shared/shared.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef, MatDialog} from '@angular/material';
import {ManageCategoryDialogComponent} from '../../categories/manage-category/manage-category-dialog.component';
import {CategoryService} from '../../categories/shared/category.service';
import {NotificationService} from '../../shared/notification.service';
import {switchMap} from 'rxjs/operators';
import {RefreshService} from '../../shared/refresh.service';
import {DeviceService} from '../../shared/device.service';
import {MasterDataService} from '../../shared/master-data.service';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Output()
  startDate = new EventEmitter<Date>();

  @Output()
  endDate = new EventEmitter<Date>();

  @Output()
  categories = new EventEmitter<String[]>();

  @Output()
  institutions = new EventEmitter<String[]>();

  categories$: Observable<Category[]>;
  institutions$: Observable<string[]>;

  filterForm: FormGroup;
  mobileView$: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private device: DeviceService,
              private bottomSheet: MatBottomSheet,
              private dialog: MatDialog,
              private masterDataService: MasterDataService,
              private categoryService: CategoryService,
              private notificationService: NotificationService,
              private refreshService: RefreshService,
              private translate: TranslateService,
              @Optional() private bottomSheetRef: MatBottomSheetRef) {
  }

  ngOnInit() {
    this.categories$ = this.refreshService.refresh$
      .pipe(switchMap(() => this.categoryService.retrieve()));

    this.institutions$ = this.masterDataService.getInstitutions();
    this.filterForm = this.formBuilder.group({
      startDate: moment.utc('2018-01-01').toDate(),
      endDate: moment.utc().toDate(),
      categories: [],
      institutions: []
    });

    const startDatePicker = this.filterForm.get('startDate');
    const endDatePicker = this.filterForm.get('endDate');
    const categorySelectionList = this.filterForm.get('categories');
    const institutionSelectionList = this.filterForm.get('institutions');

    startDatePicker.disable({onlySelf: true});
    endDatePicker.disable({onlySelf: true});

    this.subscriptions.push(startDatePicker.valueChanges
      .subscribe(value => this.startDate.emit(value))
    );

    this.subscriptions.push(endDatePicker.valueChanges
      .subscribe(value => this.endDate.emit(value))
    );

    this.subscriptions.push(categorySelectionList.valueChanges
      .subscribe(values => {
        this.categories.emit(values);
      })
    );

    this.subscriptions.push(institutionSelectionList.valueChanges
      .subscribe(values => {
        this.institutions.emit(values);
      })
    );
  }

  openAddCategoryDialog() {
    if (this.device.isTablet || this.device.isWeb) {
      const dialogRef = this.dialog.open(ManageCategoryDialogComponent);
      this.subscriptions.push(
        dialogRef.afterClosed().subscribe(category => {
          createCategory(category);
        })
      );
    } else {
      const bottomSheetRef = this.bottomSheet.open(ManageCategoryDialogComponent);
      this.subscriptions.push(
        bottomSheetRef.afterDismissed().subscribe(category => {
          createCategory(category);
        })
      );
    }

    const createCategory = (category) => {
      if (category) {
        this.subscriptions.push(
          this.categoryService.create(category)
            .subscribe(() => {

              this.translate.get('transactions.filter.categoryCreated',
                {name: category.name})
                .subscribe(translation => {
                  this.notificationService.displayInfo(translation);
                  this.refreshService.refresh();
                });

            })
        );
      }
    };
  }

  dismiss() {
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
