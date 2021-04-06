import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  /* references: https://www.freecodecamp.org/news/how-to-validate-angular-reactive-forms/ */

  title = 'frontend';

  dataEntryForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.dataEntryForm = this.fb.group({
      webAppSourceCodePath: [''],
      tableName: ['', Validators.required],
      migrationClassName: ['', Validators.required],
      columnName: [''],
      columnType: [''],
      columnLength: [''],
      columnNullable: [''],
      entityNameSingular: ['', Validators.required],
      entityNamePlural: ['', Validators.required],
      nameOfFolderContainingViews: ['', Validators.required],
      selectClauseOfQueryForGrid: ['', Validators.required],
      columnHeaderName: [''],
      correspondingDbFieldName: [''],
      uiViewPageLabel: [''],
      uiViewPageLabelCorrespondingDbFieldName: [''],
      uiViewPageFieldType: [''],
      formFieldLabel: [''],
      formFieldType: [''],
      dbColumnForThisFormField: [''],
      formFieldIsMandatory: [''],
      maximumLengthOfFormField: [''],
      validationRules: [''],
    }
    );
  }

  get dataEntryFormControl() {
    return this.dataEntryForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.dataEntryForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.dataEntryForm.value);
    }
  }
}
