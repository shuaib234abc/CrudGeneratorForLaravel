import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from './app.service';

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
    private service: AppService,
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
    this.finalJsonObject['code']['grid_loading_script'] = [];    
    this.finalJsonObject['code']['grid_loading_script']['for_datatable'] = [];        
    this.finalJsonObject['code']['grid_ui']['all_data'] = [];        
    this.finalJsonObject['code']['grid_ui']['columns'] = [];        
    this.finalJsonObject['code']['grid_ui']['visible_db_table_fields'] = [];                
    this.finalJsonObject['code']['view_page_ui'] = [];    
    this.finalJsonObject['code']['view_page_ui']['table_rows'] = [];     
    this.finalJsonObject['code']['form_ui'] = [];       
    this.finalJsonObject['code']['form_ui']['fields'] = [];   
    this.finalJsonObject['code']['form_validation_script'] = [];       
    this.finalJsonObject['code']['form_validation_script']['rules'] = [];           
  }

  get dataEntryFormControl() {
    return this.dataEntryForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.dataEntryForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      //console.table(this.dataEntryForm.value);

      //this.finalJsonObject = {};
      //this.finalJsonObject['webAppSourceCodePath'] = this.dataEntryFormControl.webAppSourceCodePath;

      this.finalJsonObject['webAppSourceCodePath'] = this.dataEntryFormControl.webAppSourceCodePath.value;
      this.finalJsonObject['database']['tableName'] = this.dataEntryFormControl.tableName.value;
      this.finalJsonObject['database']['migrationClassName'] = this.dataEntryFormControl.migrationClassName.value;
      this.finalJsonObject['database']['migrationClassName'] = this.dataEntryFormControl.migrationClassName.value + ".php";      
      this.finalJsonObject['code']['entityNameSingular'] = this.dataEntryFormControl.entityNameSingular.value;
      this.finalJsonObject['code']['entityNamePlural'] = this.dataEntryFormControl.entityNamePlural.value;
      this.finalJsonObject['code']['nameOfFolderContainingViews'] = this.dataEntryFormControl.nameOfFolderContainingViews.value;
      this.finalJsonObject['code']['selectClauseOfQueryForGrid'] = this.dataEntryFormControl.selectClauseOfQueryForGrid.value;      

      var arr = this.finalJsonObject['code']['grid_ui']['all_data'];
      var _self = this;
      arr.map(function(element: any){
        _self.finalJsonObject['code']['grid_ui']['columns'].push(element['columnHeaderName']);
        _self.finalJsonObject['code']['grid_ui']['visible_db_table_fields'].push(element['correspondingDbFieldName']);   
        _self.finalJsonObject['code']['grid_loading_script']['for_datatable'].push(element['correspondingDbFieldName']);                
      });     //ref: https://www.freecodecamp.org/news/javascript-map-how-to-use-the-js-map-function-array-method/

      /////////// ////////////////////////// //////////////////////// /////////////////////////////

      arr = this.finalJsonObject['code']['form_ui']['fields'];
      var _self = this;
      arr.map(function(element: any){

        let obj : any;
        obj = {};
        obj['field'] = "";
        obj['ruleText'] = "";
        
        var required = element['required'];
        var maxlength = element['maxlength'];
        var regex = element['regex'];

        if(required != null && required != ""){
          obj['ruleText'] += "required: " + required + ",";
        }
        if(maxlength != null && maxlength != ""){
          obj['ruleText'] += "maxlength: " + maxlength + ",";
        }    
        if(regex != null && regex != ""){
          obj['ruleText'] += "regex: " + regex + ",";
        }       
        
        if(obj['ruleText'] != ""){
          obj['field'] = element['id'];
        }

        _self.finalJsonObject['code']['form_validation_script']['rules'].push(obj);
      });     //ref: https://www.freecodecamp.org/news/javascript-map-how-to-use-the-js-map-function-array-method/

      console.log(this.finalJsonObject);

      // ref: https://medium.com/techiediaries-com/send-http-post-with-angular-9-8-httpclient-by-example-61e2dfdee8a9
      this.service.sendPostRequest(this.finalJsonObject).subscribe(
        res => {
          console.log(res);
        }
      );
      
      /////////////////////// /////////////////////
    }
  }

  removeFormDefinition(index: number){
    this.finalJsonObject['code']['form_ui']['fields'].splice(index, 1);
  }

  addFormDefinition(){
    let obj : any;
    obj = {};
    obj['label'] = this.dataEntryFormControl.formFieldLabel.value;
    obj['type'] = this.dataEntryFormControl.formFieldType.value;
    obj['id'] = this.dataEntryFormControl.dbColumnForThisFormField.value;
    obj['required'] = this.dataEntryFormControl.formFieldIsMandatory.value;
    obj['maxlength'] = this.dataEntryFormControl.maximumLengthOfFormField.value;            
    obj['regex'] = this.dataEntryFormControl.validationRules.value;

    if(obj['label'] == null || obj['label'] == ""){
      this.toastr.error('Please fill up Form field label', 'Info');
      return;
    }
    if(obj['type'] == null || obj['type'] == ""){
      this.toastr.error('Please fill up Form field type', 'Info');
      return;
    }
    if(obj['id'] == null || obj['id'] == ""){
      this.toastr.error('Please fill up DB column for this form field', 'Info');
      return;
    }
    if(obj['required'] == null || obj['required'] == ""){
      this.toastr.error('Please fill up Form field is mandatory', 'Info');
      return;
    }            

    this.finalJsonObject['code']['form_ui']['fields'].push(obj);

    this.dataEntryFormControl.formFieldLabel.setValue('');
    this.dataEntryFormControl.formFieldType.setValue('');
    this.dataEntryFormControl.dbColumnForThisFormField.setValue('');
    this.dataEntryFormControl.formFieldIsMandatory.setValue('');
    this.dataEntryFormControl.maximumLengthOfFormField.setValue(''); 
    this.dataEntryFormControl.validationRules.setValue(''); 

    document.getElementById("formFieldLabel")?.focus();
  }

  removeUiViewPageInfo(index: number){
    this.finalJsonObject['code']['view_page_ui']['table_rows'].splice(index, 1);
  }

  addUiViewPageInfo(){
    let obj : any;
    obj = {};
    obj['label'] = this.dataEntryFormControl.uiViewPageLabel.value;
    obj['propertyName'] = this.dataEntryFormControl.uiViewPageLabelCorrespondingDbFieldName.value;
    obj['dataType'] = this.dataEntryFormControl.uiViewPageFieldType.value;

    if(obj['label'] == null || obj['label'] == "" ||
    obj['propertyName'] == null || obj['propertyName'] == "" ||
    obj['dataType'] == null || obj['dataType'] == ""){
      this.toastr.error('Please fill up all fields', 'Info');
      return;
    }

    this.finalJsonObject['code']['view_page_ui']['table_rows'].push(obj);

    this.dataEntryFormControl.uiViewPageLabel.setValue('');
    this.dataEntryFormControl.uiViewPageLabelCorrespondingDbFieldName.setValue('');
    this.dataEntryFormControl.uiViewPageFieldType.setValue('');  

    document.getElementById("uiViewPageLabel")?.focus();
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

    document.getElementById("columnHeaderName")?.focus();
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
    
    document.getElementById("columnName")?.focus();
  }
}
