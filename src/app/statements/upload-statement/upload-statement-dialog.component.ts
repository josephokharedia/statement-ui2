import {Component, Inject, OnInit, Optional} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MAT_BOTTOM_SHEET_DATA, MAT_DIALOG_DATA, MatBottomSheetRef, MatDialogRef} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ManageCategoryDialogComponent} from '../../categories/manage-category/manage-category-dialog.component';
import {map} from 'rxjs/operators';
import {DeviceService} from '../../shared/device.service';

@Component({
  selector: 'app-create-statement-dialog',
  templateUrl: './upload-statement-dialog.component.html',
  styleUrls: ['./upload-statement-dialog.component.scss']
})
export class UploadStatementDialogComponent implements OnInit {

  private allowSubmitSubject = new BehaviorSubject<boolean>(false);
  allowSubmit$ = this.allowSubmitSubject.asObservable();

  constructor(@Optional() private dialogRef: MatDialogRef<ManageCategoryDialogComponent>,
              @Optional() private bottomSheetRef: MatBottomSheetRef<ManageCategoryDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
              @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private bottomSheetData: any,
              private formBuilder: FormBuilder,
              private device: DeviceService) {
  }

  ngOnInit() {
  }

  submit() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }
}
