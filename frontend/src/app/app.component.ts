import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  /* references: https://www.freecodecamp.org/news/how-to-validate-angular-reactive-forms/ */

  dataEntryForm!: FormGroup;
  submitted = false;
  finalJsonObject : any;  

  constructor(
    private service: AppService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  // this function has been taken from: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript?page=1&tab=votes#tab-top
  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  initFinalJsonObject(){
    this.finalJsonObject = {};
    this.finalJsonObject['database'] = {};
    this.finalJsonObject['database']['table_fields'] = [];
    this.finalJsonObject['code'] = {};
    this.finalJsonObject['ui_datatable_cols'] = [];        
    this.finalJsonObject['ui_data_grid'] = {};     
    this.finalJsonObject['ui_data_grid']['all_data'] = [];        
    this.finalJsonObject['ui_data_grid']['columns'] = [];        
    this.finalJsonObject['ui_data_grid']['visible_db_table_fields'] = [];                
    this.finalJsonObject['ui_view_page_fields'] = [];     
    this.finalJsonObject['ui_form_fields'] = [];          
    this.finalJsonObject['ui_form_validation_rules'] = [];     
  }

  ngOnInit() {
    this.dataEntryForm = this.fb.group({
      operatingSystem: ['', Validators.required],
      webAppSourceCodePath: [''],
      tableName: ['', Validators.required],
      entityNameSingular: ['', Validators.required],
      entityNamePlural: ['', Validators.required],
      formFieldLabel: [''],
      formFieldType: [''],
      dbColumnForThisFormField: [''],
      dbColumnTypeForThisFormField: [''],      
      formFieldIsMandatory: [''],
      maximumLengthOfFormField: [''],
      validationRules: [''],
    }
    );
    this.initFinalJsonObject();      
  }

  get dataEntryFormControl() {
    return this.dataEntryForm.controls;
  }

  alterObjectAsPerBackendSpecifications(){
    this.finalJsonObject['web_app_source_code_path'] = this.dataEntryFormControl.webAppSourceCodePath.value;
    this.finalJsonObject['operating_system'] = this.dataEntryFormControl.operatingSystem.value;    
    this.finalJsonObject['database']['table_name'] = this.dataEntryFormControl.tableName.value;
    this.finalJsonObject['database']['migration_class_name'] = "Create" + this.toTitleCase( this.finalJsonObject['database']['table_name'] ) + "Table";
    this.finalJsonObject['database']['migration_file_name'] = this.finalJsonObject['database']['migration_class_name'] + ".php";      
    this.finalJsonObject['code']['entityNameSingular'] = this.dataEntryFormControl.entityNameSingular.value;
    this.finalJsonObject['code']['entityNamePlural'] = this.dataEntryFormControl.entityNamePlural.value;
    this.finalJsonObject['code']['nameOfFolderContainingViews'] = this.finalJsonObject['database']['table_name'].toLowerCase();             

    /////////// ////////////////////////// //////////////////////// /////////////////////////////

    this.finalJsonObject['code']['selectClauseOfQueryForGrid'] = "";
    this.finalJsonObject['code']['selectClauseOfQueryForGrid'] += "select('id', ";  
    this.finalJsonObject['ui_data_grid']['columns'] = [];
    this.finalJsonObject['ui_data_grid']['visible_db_table_fields'] = [];
    this.finalJsonObject['ui_datatable_cols'] = [];
    this.finalJsonObject['ui_form_validation_rules'] = [];
    var arr = this.finalJsonObject['ui_form_fields'];
    var _self = this;
    arr.map(function(element: any){

      let obj : any;
      obj = {};
      obj['field'] = "";
      obj['ruleText'] = "";
      
      var required = element['required'];
      var maxlength = element['maxlength'];
      var regex = element['regex'];
      var type = element['type'];

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

      _self.finalJsonObject['ui_form_validation_rules'].push(obj);

      /////// ///////////// ///////////// /////////////

      var dataTypeForGridUi = "string"

      if(element['type'] != "file"){
        _self.finalJsonObject['ui_datatable_cols'].push(element['id']);     
        _self.finalJsonObject['ui_data_grid']['visible_db_table_fields'].push(element['id']);   
        _self.finalJsonObject['ui_data_grid']['columns'].push(element['label']);      
        _self.finalJsonObject['code']['selectClauseOfQueryForGrid'] += "'"+element['id']+"',";                    
      }
      else{
        dataTypeForGridUi = "image"
      }

      obj = {}
      obj['label'] = element['label'];
      obj['property_name'] = element['id'];
      obj['dataType'] = dataTypeForGridUi;            
      _self.finalJsonObject['ui_view_page_fields'].push(obj)

      ////////// /////////////// //////////////// //////////////// ////////////////////
      obj = {}
      obj['name'] = element['id'];
      if(required != null && required != ""){
        if(required == "true") obj['nullable'] = "false";
        else obj["nullable"] = "true";
      }
      else obj["nullable"] = "true";
      if(maxlength != null && maxlength != ""){
        obj['length'] = maxlength;
      }    
      obj['dataType'] = element['id_type'];
      _self.finalJsonObject['database']['table_fields'].push(obj);

    });     //ref: https://www.freecodecamp.org/news/javascript-map-how-to-use-the-js-map-function-array-method/

    //ref: https://stackoverflow.com/questions/36630230/replace-last-character-of-string-using-javascript/36630251
    this.finalJsonObject['code']['selectClauseOfQueryForGrid'] = this.finalJsonObject['code']['selectClauseOfQueryForGrid'].replace(/.$/," )");              

    console.log(this.finalJsonObject);
  }

  reset(){

    this.dataEntryFormControl.webAppSourceCodePath.setValue('')
    this.dataEntryFormControl.operatingSystem.setValue('')      
    this.dataEntryFormControl.tableName.setValue('')
    this.dataEntryFormControl.entityNameSingular.setValue('')
    this.dataEntryFormControl.entityNamePlural.setValue('')

    this.initFinalJsonObject();

  }

  onSubmit() {
    this.submitted = true;
    if (this.dataEntryForm.valid) {
      
      this.alterObjectAsPerBackendSpecifications();

      // ref: https://medium.com/techiediaries-com/send-http-post-with-angular-9-8-httpclient-by-example-61e2dfdee8a9
      this.service.sendPostRequest(this.finalJsonObject).subscribe(
        res => {
          console.log(res);
          this.toastr.success(res.message);
          this.reset();
        }
      );
      
      /////////////////////// /////////////////////
    }
  }

  removeFormDefinition(index: number){
    this.finalJsonObject['ui_form_fields'].splice(index, 1);
  }

  addFormDefinition(){
    let obj : any;
    obj = {};
    obj['label'] = this.dataEntryFormControl.formFieldLabel.value;
    obj['type'] = this.dataEntryFormControl.formFieldType.value;
    obj['id'] = this.dataEntryFormControl.dbColumnForThisFormField.value;
    obj['id_type'] = this.dataEntryFormControl.dbColumnTypeForThisFormField.value;
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
      this.toastr.error('Please fill up DB column name for this form field', 'Info');
      return;
    }
    if(obj['id_type'] == null || obj['id_type'] == ""){
      this.toastr.error('Please fill up DB column type for this form field', 'Info');
      return;
    }    
    if(obj['required'] == null || obj['required'] == ""){
      this.toastr.error('Please fill up Form field is mandatory', 'Info');
      return;
    }            

    this.finalJsonObject['ui_form_fields'].push(obj);

    this.dataEntryFormControl.formFieldLabel.setValue('');
    this.dataEntryFormControl.formFieldType.setValue('');
    this.dataEntryFormControl.dbColumnForThisFormField.setValue('');
    this.dataEntryFormControl.dbColumnTypeForThisFormField.setValue('');    
    this.dataEntryFormControl.formFieldIsMandatory.setValue('');
    this.dataEntryFormControl.maximumLengthOfFormField.setValue(''); 
    this.dataEntryFormControl.validationRules.setValue(''); 

    document.getElementById("formFieldLabel")?.focus();

    this.toastr.success("Form definition has been added. You can add more form defenitions, or finally submit the form using the 'Next' button below.");
  }  
  
}
