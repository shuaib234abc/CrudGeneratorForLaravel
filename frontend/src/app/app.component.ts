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
      webAppSourceCodePath: ['', Validators.required],
      tableName: ['', Validators.required],
      migrationClassName: ['', Validators.required],
      columnName: ['', Validators.required],
      columnType: ['', Validators.required],
      columnLength: ['', Validators.required],
      columnNullable: ['', Validators.required],
      entityNameSingular: ['', Validators.required],
      entityNamePlural: ['', Validators.required],
      nameOfFolderContainingViews: ['', Validators.required],
      selectClauseOfQueryForGrid: ['', Validators.required],
      columnHeaderName: ['', Validators.required],
      correspondingDbFieldName: ['', Validators.required],
      uiViewPageLabel: ['', Validators.required],
      uiViewPageLabelCorrespondingDbFieldName: ['', Validators.required],
      uiViewPageFieldType: ['', Validators.required],
      formFieldLabel: ['', Validators.required],
      formFieldType: ['', Validators.required],
      dbColumnForThisFormField: ['', Validators.required],
      formFieldIsMandatory: ['', Validators.required],
      maximumLengthOfFormField: ['', Validators.required],
      validationRules: ['', Validators.required],
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
