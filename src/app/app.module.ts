import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
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
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
} from '@angular/material';
import {FlexLayoutModule, ObservableMediaProvider} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {StatementsComponent} from './statements/statements.component';
import {CategoriesComponent} from './categories/categories.component';
import {ManageCategoryDialogComponent} from './categories/manage-category/manage-category-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterComponent} from './transactions/filter-transactions/filter.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {NgProgressInterceptor, NgProgressModule} from 'ngx-progressbar';
import {HttpInterceptorService} from './shared/http-interceptor.service';
import {StatementDetailsComponent} from './statements/statement-details/statement-details.component';
import {ChartsModule} from 'ng2-charts';
import {LayoutModule} from '@angular/cdk/layout';
import {DeviceClassDirective} from './shared/device-class.directive';
import {UploadStatementDialogComponent} from './statements/upload-statement/upload-statement-dialog.component';
import {translationEn} from './shared/translationEn';
import { NavigationComponent } from './navigation/navigation.component';


const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
  {path: 'transactions', component: TransactionsComponent, data: {title: 'Transactions'}},
  {path: 'statements', component: StatementsComponent, data: {title: 'Statements'}},
  {path: 'categories', component: CategoriesComponent, data: {title: 'Categories'}},
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
    UploadStatementDialogComponent,
    // NavigationComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatToolbarModule, MatSidenavModule, MatButtonModule,
    MatIconModule, MatListModule, MatFormFieldModule, FlexLayoutModule, HttpClientModule, MatTableModule,
    MatTabsModule, MatInputModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule,
    MatDatepickerModule, MatNativeDateModule, MatListModule, MatCheckboxModule, MatExpansionModule, MatChipsModule, MatDialogModule,
    FormsModule, ReactiveFormsModule, MatSnackBarModule, Ng2GoogleChartsModule, NgProgressModule, MatCardModule,
    MatSelectModule, MatRippleModule, ChartsModule, LayoutModule, MatBottomSheetModule, MatGridListModule,
    MatAutocompleteModule, MatButtonToggleModule,

    TranslateModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  providers: [
    ObservableMediaProvider,
    {provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: LOCALE_ID, useValue: 'en-ZA'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ManageCategoryDialogComponent, FilterComponent,
    StatementDetailsComponent, UploadStatementDialogComponent],
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
