import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {StatementsComponent} from './statements/statements.component';
import {CategoriesComponent} from './categories/categories.component';
import {ManageCategoryDialogComponent} from './categories/manage-category/manage-category-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterComponent} from './transactions/filter-transactions/filter.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {StatementDetailsComponent} from './statements/statement-details/statement-details.component';
import {ChartsModule} from 'ng2-charts';
import {LayoutModule} from '@angular/cdk/layout';
import {DeviceClassDirective} from './shared/device-class.directive';
import {translationEn} from './shared/translationEn';
import {SidenavContainerDirective, SidenavToggleDirective} from './navigation/SidenavDirective';
import {SidenavToggleComponent} from './navigation/sidenav-toggle.component';
import {ErrorHandlerService} from './shared/error-handler.service';
import {NotificationComponent} from './notification/notification.component';
import {HeaderComponent} from './navigation/header.component';
import {MainComponent} from './navigation/main.component';
import {NewStatementComponent} from './statements/new-statement/new-statement.component';
import {DraftComponent} from './statements/draft/draft.component';
import {StatementDraftResolver} from './statements/new-statement/StatementDraftResolver';
import { NoResultsComponent } from './shared/no-results/no-results.component';
import { VarDirectiveDirective } from './shared/var-directive.directive';


const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'transactions', component: TransactionsComponent},
  {path: 'statements', component: StatementsComponent},
  {
    path: 'statements/new-statement',
    component: NewStatementComponent,
    resolve: {draft: StatementDraftResolver}
  },
  {path: 'categories', component: CategoriesComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    StatementsComponent,
    CategoriesComponent,
    ManageCategoryDialogComponent,
    FilterComponent,
    DashboardComponent,
    StatementDetailsComponent,
    DeviceClassDirective,
    SidenavContainerDirective,
    SidenavToggleDirective,
    SidenavToggleComponent,
    NotificationComponent,
    HeaderComponent,
    MainComponent,
    NewStatementComponent,
    DraftComponent,
    NoResultsComponent,
    VarDirectiveDirective,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, NgProgressHttpModule, MatToolbarModule, MatSidenavModule, MatButtonModule,
    MatIconModule, MatListModule, MatFormFieldModule, HttpClientModule, MatTableModule,
    MatTabsModule, MatInputModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule,
    MatDatepickerModule, MatNativeDateModule, MatListModule, MatCheckboxModule, MatExpansionModule, MatChipsModule, MatDialogModule,
    FormsModule, ReactiveFormsModule, MatSnackBarModule, Ng2GoogleChartsModule, NgProgressModule, MatCardModule,
    MatSelectModule, MatRippleModule, ChartsModule, LayoutModule, MatBottomSheetModule, MatGridListModule,
    MatAutocompleteModule, MatButtonToggleModule, MatStepperModule,

    TranslateModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  providers: [
    StatementDraftResolver,
    {provide: LOCALE_ID, useValue: 'en-ZA'},
    {provide: ErrorHandler, useClass: ErrorHandlerService},
  ],
  bootstrap: [AppComponent],
  entryComponents: [ManageCategoryDialogComponent, FilterComponent,
    StatementDetailsComponent],
})
export class AppModule {

  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    translate.setTranslation('en', translationEn);
  }
}
