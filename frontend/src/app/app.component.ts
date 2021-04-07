import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  finalJsonObject : any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
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
    this.finalJsonObject = {};
    this.finalJsonObject['database'] = {};
    this.finalJsonObject['database']['table_fields'] = [];
    this.finalJsonObject['code'] = {};
    this.finalJsonObject['code']['grid_ui'] = [];    
    this.finalJsonObject['code']['grid_ui']['all_data'] = [];        
  }

  get dataEntryFormControl() {
    return this.dataEntryForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.dataEntryForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.dataEntryForm.value);

      this.finalJsonObject = {};
      this.finalJsonObject['webAppSourceCodePath'] = this.dataEntryFormControl.webAppSourceCodePath;

    }
  }

  removeUiGridInfo(index: number){
    this.finalJsonObject['code']['grid_ui']['all_data'].splice(index, 1);
  }

  addUiGridInfo(){
    let obj : any;
    obj = {};
    obj['columnHeaderName'] = this.dataEntryFormControl.columnHeaderName.value;
    obj['correspondingDbFieldName'] = this.dataEntryFormControl.correspondingDbFieldName.value;

    if(obj['columnHeaderName'] == null || obj['columnHeaderName'] == "" ||
    obj['correspondingDbFieldName'] == null || obj['correspondingDbFieldName'] == ""){
      this.toastr.error('Please fill up all fields', 'Info');
      return;
    }

    this.finalJsonObject['code']['grid_ui']['all_data'].push(obj);

    this.dataEntryFormControl.columnHeaderName.setValue('');
    this.dataEntryFormControl.correspondingDbFieldName.setValue('');  
  }

  removeColumn(index: number){
    this.finalJsonObject['database']['table_fields'].splice(index, 1);
  }

  addColumn(){
    let obj : any;
    obj = {};
    obj['name'] = this.dataEntryFormControl.columnName.value;
    obj['dataType'] = this.dataEntryFormControl.columnType.value;
    obj['length'] = this.dataEntryFormControl.columnLength.value;
    obj['nullable'] = this.dataEntryFormControl.columnNullable.value;

    if(obj['dataType'] == "integer" || obj['dataType'] == "bigInteger" ||
    obj['dataType'] == "double" || obj['dataType'] == "binary"){
      obj['length'] = 1;
    }

    if(obj['name'] == null || obj['name'] == "" ||
    obj['dataType'] == null || obj['dataType'] == "" ||
    obj['length'] == null || obj['length'] == "" ||
    obj['nullable'] == null || obj['nullable'] == "" ){
      this.toastr.error('Please fill up all fields', 'Info');
      return;
    }

    this.finalJsonObject['database']['table_fields'].push(obj);

    this.dataEntryFormControl.columnName.setValue('');
    this.dataEntryFormControl.columnType.setValue('');
    this.dataEntryFormControl.columnLength.setValue('');        
    this.dataEntryFormControl.columnNullable.setValue('');            
  }
}
