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

  title = 'frontend';

  dataEntryForm!: FormGroup;
  submitted = false;
  finalJsonObject : any;
  generateDataLinkClicked : boolean
  downloadLinkClicked : boolean
  downloadJsonHref : SafeUrl
  uploadJsonFile!: File

  constructor(
    private service: AppService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { 
    this.generateDataLinkClicked = false
    this.downloadLinkClicked = false
    this.downloadJsonHref = ""
  }

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
      selectClauseOfQueryForGrid: [''],
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
    this.initFinalJsonObject();      
  }

  get dataEntryFormControl() {
    return this.dataEntryForm.controls;
  }

  alterObjectAsPerBackendSpecifications(){
    this.finalJsonObject['web_app_source_code_path'] = this.dataEntryFormControl.webAppSourceCodePath.value;
    this.finalJsonObject['database']['table_name'] = this.dataEntryFormControl.tableName.value;
    this.finalJsonObject['database']['migration_class_name'] = "Create" + this.toTitleCase( this.finalJsonObject['database']['table_name'] ) + "Table";
    this.finalJsonObject['database']['migration_file_name'] = this.finalJsonObject['database']['migration_class_name'] + ".php";      
    this.finalJsonObject['code']['entityNameSingular'] = this.dataEntryFormControl.entityNameSingular.value;
    this.finalJsonObject['code']['entityNamePlural'] = this.dataEntryFormControl.entityNamePlural.value;
    this.finalJsonObject['code']['nameOfFolderContainingViews'] = this.finalJsonObject['database']['table_name'].toLowerCase();             

    /////////// ////////////////////////// //////////////////////// /////////////////////////////

    this.finalJsonObject['code']['selectClauseOfQueryForGrid'] = "";
    this.finalJsonObject['code']['selectClauseOfQueryForGrid'] += "select('id', ";  
    this.finalJsonObject['code']['grid_ui']['columns'] = [];
    this.finalJsonObject['code']['grid_ui']['visible_db_table_fields'] = [];
    this.finalJsonObject['code']['grid_loading_script']['for_datatable'] = [];
    this.finalJsonObject['code']['form_validation_script']['rules'] = [];
    var arr = this.finalJsonObject['code']['form_ui']['fields'];
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

      _self.finalJsonObject['code']['form_validation_script']['rules'].push(obj);

      /////// ///////////// ///////////// /////////////

      var dataTypeForGridUi = "string"

      if(element['type'] != "file"){
        _self.finalJsonObject['code']['grid_loading_script']['for_datatable'].push(element['id']);     
        _self.finalJsonObject['code']['grid_ui']['visible_db_table_fields'].push(element['id']);   
        _self.finalJsonObject['code']['grid_ui']['columns'].push(element['label']);      
        _self.finalJsonObject['code']['selectClauseOfQueryForGrid'] += "'"+element['id']+"',";                    
      }
      else{
        dataTypeForGridUi = "image"
      }

      obj = {}
      obj['label'] = element['label'];
      obj['property_name'] = element['id'];
      obj['dataType'] = dataTypeForGridUi;            
      _self.finalJsonObject['code']['view_page_ui']['table_rows'].push(obj)

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
      obj['dataType'] = "string";
      _self.finalJsonObject['database']['table_fields'].push(obj);

    });     //ref: https://www.freecodecamp.org/news/javascript-map-how-to-use-the-js-map-function-array-method/

    //ref: https://stackoverflow.com/questions/36630230/replace-last-character-of-string-using-javascript/36630251
    this.finalJsonObject['code']['selectClauseOfQueryForGrid'] = this.finalJsonObject['code']['selectClauseOfQueryForGrid'].replace(/.$/," )");              

    console.log(this.finalJsonObject);
  }

  onSubmit() {
    this.submitted = true;
    if (this.dataEntryForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      //console.table(this.dataEntryForm.value);

      //this.finalJsonObject = {};
      //this.finalJsonObject['webAppSourceCodePath'] = this.dataEntryFormControl.webAppSourceCodePath;

      this.alterObjectAsPerBackendSpecifications();

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

  generateFile(){

    this.alterObjectAsPerBackendSpecifications();    

    this.generateDataLinkClicked = true
    this.downloadLinkClicked = false

    //ref: https://stackoverflow.com/questions/42360665/angular2-to-export-download-json-file
    var theJSON = JSON.stringify(this.finalJsonObject);

    console.log(this.finalJsonObject);
    console.log(theJSON);

    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
  }

  downloadFile(){
    this.generateDataLinkClicked = false
    this.downloadLinkClicked = false

    console.log(this.finalJsonObject);
  }

  onUploadedJsonFileChanged(event: any){
    //ref: https://stackoverflow.com/questions/54971238/upload-json-file-using-angular-6
    this.uploadJsonFile = event.target.files[0];  
  }

  processUploadedJson(){
    this.generateDataLinkClicked = false
    this.downloadLinkClicked = false

    //ref: https://stackoverflow.com/questions/54971238/upload-json-file-using-angular-6
    const fileReader = new FileReader();
    fileReader.readAsText(this.uploadJsonFile, "UTF-8");
    fileReader.onload = () => {

      var fileReadResult = fileReader.result?.toString();
      if(fileReadResult == null || fileReadResult == undefined) fileReadResult = ""
      var jsonData = JSON.parse(fileReadResult)

      //ref: https://stackoverflow.com/questions/5873624/parse-json-string-into-a-particular-object-prototype-in-javascript
      this.finalJsonObject = Object.assign({}, jsonData)

      this.dataEntryFormControl.webAppSourceCodePath.setValue(this.finalJsonObject['webAppSourceCodePath'])
      this.dataEntryFormControl.tableName.setValue(this.finalJsonObject['database']['tableName'])
      this.dataEntryFormControl.migrationClassName.setValue(this.finalJsonObject['database']['migrationClassName'])
      this.dataEntryFormControl.entityNameSingular.setValue(this.finalJsonObject['code']['entityNameSingular'])
      this.dataEntryFormControl.entityNamePlural.setValue(this.finalJsonObject['code']['entityNamePlural'])
      this.dataEntryFormControl.nameOfFolderContainingViews.setValue(this.finalJsonObject['code']['nameOfFolderContainingViews'])
      this.dataEntryFormControl.selectClauseOfQueryForGrid.setValue(this.finalJsonObject['code']['selectClauseOfQueryForGrid'])

    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}
