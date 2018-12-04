import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStatementDialogComponent } from './upload-statement-dialog.component';

describe('UploadStatementDialogComponent', () => {
  let component: UploadStatementDialogComponent;
  let fixture: ComponentFixture<UploadStatementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadStatementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadStatementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
