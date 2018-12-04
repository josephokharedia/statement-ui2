import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {CategoryService} from './shared/category.service';
import {Observable, Subscription} from 'rxjs';
import {Category} from '../shared/shared.model';
import {NotificationService} from '../shared/notification.service';
import {ManageCategoryDialogComponent} from './manage-category/manage-category-dialog.component';
import {switchMap} from 'rxjs/operators';
import {RefreshService} from '../shared/refresh.service';
import {DeviceService} from '../shared/device.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories$: Observable<Category[]>;
  private subscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet,
              private categoryService: CategoryService,
              private notificationService: NotificationService,
              private device: DeviceService,
              private translate: TranslateService,
              private refreshService: RefreshService) {
  }

  ngOnInit() {
    this.categories$ = this.refreshService.refresh$
      .pipe(switchMap(() => this.categoryService.retrieve()));
  }

  openAddCategoryDialog() {
    const dialogClosed$ = this.device.isHandset
      ? this.bottomSheet.open(ManageCategoryDialogComponent,
        {disableClose: true, data: {}}).afterDismissed()
      : this.dialog.open(ManageCategoryDialogComponent,
        {disableClose: true, data: {}}).afterClosed();
    dialogClosed$.subscribe(newCategory => {
      if (newCategory) {
        this.subscriptions.push(
          this.categoryService.create(newCategory).subscribe(
            () => {

              this.subscriptions.push(
                this.translate.get('categories.categoryCreated',
                  {name: newCategory.name})
                  .subscribe(translation => {
                    this.notificationService.displayInfo(translation);
                    this.refreshService.refresh();
                  })
              );
            }
          )
        );
      }
    });
  }

  openEditCategoryDialog(category: Category) {
    const dialogClosed$ = this.device.isHandset
      ? this.bottomSheet.open(ManageCategoryDialogComponent,
        {disableClose: true, data: {category: category, action: 'EDIT'}})
        .afterDismissed()
      : this.dialog.open(ManageCategoryDialogComponent,
        {disableClose: true, data: {category: category, action: 'EDIT'}})
        .afterClosed();
    dialogClosed$.subscribe(updatedCategory => {
      if (updatedCategory) {
        this.subscriptions.push(
          this.categoryService.update(updatedCategory).subscribe(() => {

            this.subscriptions.push(
              this.translate.get('categories.manageCategory.categoryUpdated',
                {name: updatedCategory.name})
                .subscribe(translation => {
                  this.notificationService.displayInfo(translation);
                  this.refreshService.refresh();
                })
            );

          })
        );
      }
    });
  }

  openDeleteCategoryDialog(category: Category) {
    const dialogRef = this.dialog.open(ManageCategoryDialogComponent, {
      data: {category: category, action: 'DELETE'}
    });
    dialogRef.afterClosed().subscribe(deletingCategory => {
      if (deletingCategory) {
        this.subscriptions.push(
          this.categoryService.delete(deletingCategory._id).subscribe(() => {

            this.subscriptions.push(
              this.translate.get('categories.manageCategory.categoryDeleted',
                {name: deletingCategory.name})
                .subscribe(translation => {
                  this.notificationService.displayInfo(translation);
                  this.refreshService.refresh();
                })
            );

          })
        );
      }
    });
  }

  trackByFn(index, item) {
    return item._id;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
