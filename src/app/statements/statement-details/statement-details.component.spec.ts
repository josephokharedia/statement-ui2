import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementDetailsComponent } from './statement-details.component';

describe('StatementDetailsComponent', () => {
  let component: StatementDetailsComponent;
  let fixture: ComponentFixture<StatementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
