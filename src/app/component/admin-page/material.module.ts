import { NgModule } from "@angular/core";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';


const MODULES = [
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatTabsModule,
  MatIconModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatRadioModule
];

@NgModule({
  imports: [MODULES],
  exports: [MODULES],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', floatLabel: 'always' } },
    { provide: MAT_DIALOG_DATA, useValue: '' }
  ]
})
export class MaterialModule { }
