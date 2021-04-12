import json
import subprocess
from datetime import datetime
import re
from flask import Flask, request
from flask_cors import CORS
import os
import shutil

app = Flask(__name__)               # ref: https://flask.palletsprojects.com/en/1.1.x/quickstart/#a-minimal-application
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})           # ref: https://flask-cors.readthedocs.io/en/latest/

all_raw_data = None
migration_file_name = None
operating_system = None

def copy_template_files():
#{
    global operating_system

    if(operating_system == "linux"):
    #{
        # references: https://stackabuse.com/executing-shell-commands-with-python/
        subprocess.run(["cp", "templates_part_1/2020_10_27_164655_create_menus_table.php", "output_part_1/2020_10_27_164655_create_menus_table.php"])
        subprocess.run(["cp", "templates_part_1/add.blade.php", "output_part_1/add.blade.php"])
        subprocess.run(["cp", "templates_part_1/edit.blade.php", "output_part_1/edit.blade.php"])
        subprocess.run(["cp", "templates_part_1/index.blade.php", "output_part_1/index.blade.php"])
        subprocess.run(["cp", "templates_part_1/menu.js", "output_part_1/menu.js"])
        subprocess.run(["cp", "templates_part_1/Menu.php", "output_part_1/Menu.php"])
        subprocess.run(["cp", "templates_part_1/MenuApiController.php", "output_part_1/MenuApiController.php"])
        subprocess.run(["cp", "templates_part_1/MenuController.php", "output_part_1/MenuController.php"])
        subprocess.run(["cp", "templates_part_1/view.blade.php", "output_part_1/view.blade.php"])
        subprocess.run(["cp", "templates_part_1/web.php", "output_part_1/web.php"])
        subprocess.run(["cp", "templates_part_2/menu.js", "output_part_2/menu.js"])
        subprocess.run(["cp", "templates_part_2/regex_definitions.js", "output_part_2/regex_definitions.js"])
    #}
    elif(operating_system == "windows"):
    #{
        ## ref: https://stackoverflow.com/questions/41076401/ioerror-using-shutil-copyfile-on-windows
        shutil.copyfile("templates_part_1\\2020_10_27_164655_create_menus_table.php", "output_part_1\\2020_10_27_164655_create_menus_table.php")
        shutil.copyfile("templates_part_1\\add.blade.php", "output_part_1\\add.blade.php")
        shutil.copyfile("templates_part_1\\edit.blade.php", "output_part_1\\edit.blade.php")
        shutil.copyfile("templates_part_1\\index.blade.php", "output_part_1\\index.blade.php")
        shutil.copyfile("templates_part_1\\menu.js", "output_part_1\\menu.js")
        shutil.copyfile("templates_part_1\\Menu.php", "output_part_1\\Menu.php")
        shutil.copyfile("templates_part_1\\MenuApiController.php", "output_part_1\\MenuApiController.php")
        shutil.copyfile("templates_part_1\\MenuController.php", "output_part_1\\MenuController.php")
        shutil.copyfile("templates_part_1\\view.blade.php", "output_part_1\\view.blade.php")
        shutil.copyfile("templates_part_1\\web.php", "output_part_1\\web.php")
        shutil.copyfile("templates_part_2\\menu.js", "output_part_2\\menu.js")
        shutil.copyfile("templates_part_2\\regex_definitions.js", "output_part_2\\regex_definitions.js")        
    #}


#}

def rename_output_files():
#{
    global migration_file_name
    global operating_system

    #references: https://stackoverflow.com/questions/32490629/getting-todays-date-in-yyyy-mm-dd-in-python
    migration_file_name = datetime.today().strftime('%Y_%m_%d_%H%M%S') + "_" + all_raw_data['database']['migration_file_name'];

    if(operating_system == "linux"):
    #{
        # references: https://stackabuse.com/executing-shell-commands-with-python/
        # https://www.geeksforgeeks.org/isupper-islower-lower-upper-python-applications/

        subprocess.run(["mv", "output_part_1/2020_10_27_164655_create_menus_table.php", "output_part_1/" + migration_file_name])
        subprocess.run(["mv", "output_part_1/menu.js", "output_part_1/" + all_raw_data['code']['entityNameSingular'].lower() + ".js"])
        subprocess.run(["mv", "output_part_1/Menu.php", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + ".php"])
        subprocess.run(["mv", "output_part_1/MenuApiController.php", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + "ApiController.php"])
        subprocess.run(["mv", "output_part_1/MenuController.php", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + "Controller.php"])
        subprocess.run(["mv", "output_part_2/menu.js", "output_part_2/" + all_raw_data['code']['entityNameSingular'].lower() + ".js"])
    #}
    elif(operating_system == "windows"):
    #{
        ## ref: https://stackoverflow.com/questions/41076401/ioerror-using-shutil-copyfile-on-windows
        # # https://docs.python.org/2/library/shutil.html

        shutil.move("output_part_1/2020_10_27_164655_create_menus_table.php", "output_part_1/" + migration_file_name)
        shutil.move("output_part_1/menu.js", "output_part_1/" + all_raw_data['code']['entityNameSingular'].lower() + ".js")
        shutil.move("output_part_1/Menu.php", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + ".php")
        shutil.move("output_part_1/MenuApiController.php", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + "ApiController.php")
        shutil.move("output_part_1/MenuController.php", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + "Controller.php")
        shutil.move("output_part_2/menu.js", "output_part_2/" + all_raw_data['code']['entityNameSingular'].lower() + ".js")
    #}

#}

def change_migration_file():
#{
    global migration_file_name
    global all_raw_data

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['database']['table_fields']:
    #{
        replacement_string = replacement_string + "$table->" + x['dataType'] + "('" + x['name'] + "'"
        if(
            x['dataType'] == 'bigInteger' or
            x['dataType'] == 'integer' or
            x['dataType'] == 'date' or
            x['dataType'] == 'dateTime' or
            x['dataType'] == 'binary' or
            x['dataType'] == 'longText' or
            x['dataType'] == 'text'):       #references: https://laravel.com/docs/4.2/schema, https://laravel.com/docs/8.x/migrations
        #{
            replacement_string = replacement_string + ")"
        #}
        elif(x['dataType'] == 'double'):                #references: https://laravel.com/docs/4.2/schema
        #{
            replacement_string = replacement_string + ", " + x['length'] + ", 2)"
        #}
        else:
        #{
            replacement_string = replacement_string + ", " + x['length'] + ")"
        #}

        # ref: https://www.geeksforgeeks.org/python-check-whether-given-key-already-exists-in-a-dictionary/
        if("nullable" in x.keys() and x['nullable'] != None and x['nullable'] == "true"):
        #{
            replacement_string = replacement_string + "->nullable()"
        #}

        replacement_string = replacement_string + ";"
        replacement_string = replacement_string + "\n"
    #}
    # end of for loop

    replacement_string = replacement_string + "/* ref: https://laravel.com/docs/8.x/migrations */"
    replacement_string = replacement_string + "\n\n"

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/" + migration_file_name, 'r+') as f:
        text = f.read()
        text = re.sub("--- PLACEHOLDER_FIELDS ---", replacement_string, text)
        text = re.sub("--placeholder_class_name--", all_raw_data['database']['migration_class_name'], text)
        text = re.sub("--placeholder_table_name--", all_raw_data['database']['table_name'], text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def add_tabs(number_of_tabs):
#{
    str = ""

    #reference: https://www.w3schools.com/python/ref_func_range.asp
    for i in range(number_of_tabs):
        str += "\t"

    return str
#}

def change_blade_file_for_add():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['ui_form_fields']:
    #{
        replacement_string += add_tabs(7) + "<div class=\"col-xs-12 col-sm-12 col-md-12\">\n"
        replacement_string += add_tabs(8) + "<div class=\"form-group\">\n"
        replacement_string += add_tabs(9) + "<strong>"+ x['label'] +":</strong>\n"
        if(x['type'] == "text" or x['type'] == "number"):
            replacement_string += add_tabs(9) + "<input type=\""+ x['type'] +"\" id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" placeholder=\""+ x['label'] +"\">\n"
        if(x['type'] == "combobox"):
            replacement_string += add_tabs(9) + "<select id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" >\n"
            replacement_string += add_tabs(10) + "<option value=\"\">Select Item</option>\n"
            replacement_string += add_tabs(9) + "</select>\n"
        if(x['type'] == "textarea"):
            replacement_string += add_tabs(9) + "<textarea id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" placeholder=\""+ x['label'] +"\"></textarea>\n"
        if(x['type'] == "file"):
            replacement_string += add_tabs(9) + "<input type=\""+ x['type'] +"\" id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" >\n"
        replacement_string += add_tabs(8) + "</div>\n"
        replacement_string += add_tabs(7) + "</div>\n"

    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/add.blade.php", 'r+') as f:
        text = f.read()
        text = re.sub("url\(\'\/menus", "url('/" + all_raw_data['code']['nameOfFolderContainingViews'], text);
        text = re.sub("validation/menu.js", "validation/" + all_raw_data['code']['entityNameSingular'].lower() + ".js", text);
        text = re.sub("--PLACEHOLDER_FORM_FIELDS--", replacement_string, text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_blade_file_for_edit():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['ui_form_fields']:
    #{
        replacement_string += add_tabs(7) + "<div class=\"col-xs-12 col-sm-12 col-md-12\">\n"
        replacement_string += add_tabs(8) + "<div class=\"form-group\">\n"
        replacement_string += add_tabs(9) + "<strong>"+ x['label'] +":</strong>\n"
        if(x['type'] == "text" or x['type'] == "number"):
            replacement_string += add_tabs(9) + "<input type=\""+ x['type'] +"\" value=\"{{$data->"+ x['id'] +"}}\" id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" placeholder=\""+ x['label'] +"\">\n"
        if(x['type'] == "combobox"):
            replacement_string += add_tabs(9) + "<select id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" >\n"
            replacement_string += add_tabs(10) + "<option value=\"\">Select Item</option>\n"
            replacement_string += add_tabs(9) + "</select>\n"
        if(x['type'] == "textarea"):
            replacement_string += add_tabs(9) + "<textarea id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" placeholder=\""+ x['label'] +"\">{{$data->"+ x['id'] +"}}</textarea>\n"
        if(x['type'] == "file"):
            replacement_string += add_tabs(9) + "<input type=\""+ x['type'] +"\" id=\""+ x['id'] +"\" name=\""+ x['id'] +"\" class=\"form-control\" >\n"
        replacement_string += add_tabs(8) + "</div>\n"
        replacement_string += add_tabs(7) + "</div>\n"

    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/edit.blade.php", 'r+') as f:
        text = f.read()
        text = re.sub("url\(\'\/menus", "url('/" + all_raw_data['code']['nameOfFolderContainingViews'], text);
        text = re.sub("validation/menu.js", "validation/" + all_raw_data['code']['entityNameSingular'].lower() + ".js", text);
        text = re.sub("--PLACEHOLDER_FORM_FIELDS--", replacement_string, text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_blade_file_for_index():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['ui_data_grid']['columns']:
    #{
        replacement_string += add_tabs(17) + "<th>"+ x +"</th>\n"
    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/index.blade.php", 'r+') as f:
        text = f.read()
        text = re.sub("url\(\'\/menus", "url('/" + all_raw_data['code']['nameOfFolderContainingViews'], text);
        text = re.sub("gridloading/menu.js", "gridloading/" + all_raw_data['code']['entityNameSingular'].lower() + ".js", text);
        text = re.sub("__PLACEHOLDER_TABLE_FIELDS__", replacement_string, text)
        text = re.sub("PLACEHOLDER_ENTITY_NAME_SINGULAR", all_raw_data['code']['entityNameSingular'], text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_js_file_for_datatable():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['ui_datatable_cols']:
    #{
        replacement_string += add_tabs(12) + "{ \"data\": \""+x+"\" },\n"
    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/"+all_raw_data['code']['entityNameSingular'].lower()+".js", 'r+') as f:
        text = f.read()
        text = re.sub("url\(\'\/menus", "url('/" + all_raw_data['code']['nameOfFolderContainingViews'], text);
        text = re.sub("\/api\/menus", "/api/" + all_raw_data['code']['entityNamePlural'].lower(), text);
        text = re.sub("__FIELDS__", replacement_string, text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_js_file_for_form_validation():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    jquery_datepicker_need_to_be_used = False
    for x in all_raw_data['ui_form_fields']:
    #{
        # ref: https://www.geeksforgeeks.org/python-check-whether-given-key-already-exists-in-a-dictionary/
        if('use_datepicker' in x.keys() and x['use_datepicker'] == True):
            jquery_datepicker_need_to_be_used = True
            break

    #}

    replacement_string_for_datepicker = ""
    if(jquery_datepicker_need_to_be_used == True):
    #{
        replacement_string_for_datepicker += add_tabs(12) + "//references: https://api.jqueryui.com/datepicker/#option-dateFormat" + "\n"

        for x in all_raw_data['ui_form_fields']:
        #{
            if('use_datepicker' in x.keys() and x['use_datepicker'] == True):
            #{
                y = x['datepicker_options']

                replacement_string_for_datepicker += add_tabs(12) + "jQuery(\"#"+ x["id"] +"\").datepicker({" + "\n"
                replacement_string_for_datepicker += add_tabs(13) + "\"dateFormat\" : \""+ y["format"] +"\"," + "\n"
                if(y['changeMonth'] == True):
                    replacement_string_for_datepicker += add_tabs(13) + "\"changeMonth\" : true," + "\n"
                if(y['changeYear'] == True):
                    replacement_string_for_datepicker += add_tabs(13) + "\"changeYear\" : true," + "\n"
                if(y['useMaxDate'] == True):
                    replacement_string_for_datepicker += add_tabs(13) + "\"maxDate\": "+ y["maxDateFirstPart"] +"*"+ y["maxDateSecondPart"] +"," + "\n"
                if(y['useYearRange'] == True):
                    replacement_string_for_datepicker += add_tabs(13) + "\"yearRange\" : \""+ y["yearRangeFirstPart"] +":"+ y["yearRangeSecondPart"] +"\"," + "\n"
                if(y['useDefaultDate'] == True):
                    replacement_string_for_datepicker += add_tabs(13) + "\"defaultDate\": "+ y["defaultDateFirstPart"] +"*"+ y["defaultDateSecondPart"] +"," + "\n"
                replacement_string_for_datepicker += add_tabs(12) + "});" + "\n"
            #}
        #}

        replacement_string_for_datepicker += "\n\n"
    #}

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    ## https://www.w3schools.com/python/gloss_python_array_length.asp
    counter = 0
    rules_count = len(all_raw_data['ui_form_validation_rules'])
    for x in all_raw_data['ui_form_validation_rules']:
    #{
        replacement_string += add_tabs(12) + x['field'] + ": { " + x['ruleText'] + " }"

        counter = counter + 1

        if (counter == rules_count): replacement_string += "\n"
        else: replacement_string += ",\n"
    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_2/"+all_raw_data['code']['entityNameSingular'].lower()+".js", 'r+') as f:
        text = f.read()
        text = re.sub("__PLACEHOLDER_1__", replacement_string, text)
        text = re.sub("__JQUERY_DATEPICKER_CODE_PLACEHOLDER__", replacement_string_for_datepicker, text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_model():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/" + all_raw_data['code']['entityNameSingular'] + ".php", 'r+') as f:
        text = f.read()
        text = re.sub("class Menu", "class " + all_raw_data['code']['entityNameSingular'], text);
        text = re.sub("__PLACEHOLDER_1__", "protected $table = '"+all_raw_data['database']['table_name']+"';  //ref: https://laravel.com/docs/8.x/eloquent", text);
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_api_controller():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string_for_where_conditions = ""
    replacement_string_for_ordering = ""
    counter = 0
    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['database']['table_fields']:
    #{
        # ref: https://stackoverflow.com/questions/7571635/fastest-way-to-check-if-a-value-exists-in-a-list
        if(x['name'] in all_raw_data['ui_data_grid']['visible_db_table_fields'] and x['dataType'] != "longText"):
        #{
            do_nothing_here = 1
        #}
        else:
        #{
            continue;
        #}

        replacement_string_for_where_conditions += add_tabs(4) + "$query = $query->"

        if(counter==0): replacement_string_for_where_conditions += "where('"
        else: replacement_string_for_where_conditions += "orWhere('"

        replacement_string_for_where_conditions += x['name']

        if(x['dataType'] == "string"):
        #{
            replacement_string_for_where_conditions += "', 'like', '%' . $datatableNavigationParams->searchBoxValue . '%');"
        #}
        if(x['dataType'] == "integer" or x['dataType'] == "bigInteger" or x['dataType'] == "double"):
        #{
            replacement_string_for_where_conditions += "', '=', $datatableNavigationParams->searchBoxValue);"
        #}

        replacement_string_for_where_conditions += "\n"

        counter = counter + 1
    #}
    # end of for loop

    counter = 1
    for x in all_raw_data['database']['table_fields']:
    #{
        if(x['name'] in all_raw_data['ui_data_grid']['visible_db_table_fields']):
        #{
            do_nothing_here = 1
        #}
        else:
        #{
            continue;
        #}

        replacement_string_for_ordering += add_tabs(4) + "case "+str(counter)+":" + "\n"
        replacement_string_for_ordering += add_tabs(5) + "$orderDir == \"desc\" ? $query = $query->orderByRaw('"+x['name']+" desc') : $query = $query->orderByRaw('"+x['name']+"');" + "\n"
        replacement_string_for_ordering += add_tabs(5) + "break;" + "\n"

        counter = counter + 1
    #}
    # end of for loop

    counter = 1
    for x in all_raw_data['database']['table_fields']:
    #{
        if(counter == 1):
        #{
            replacement_string_for_ordering += add_tabs(4) + "default:" + "\n"
            replacement_string_for_ordering += add_tabs(5) + "$orderDir == \"desc\" ? $query = $query->orderByRaw('"+x['name']+" desc') : $query = $query->orderByRaw('"+x['name']+"');" + "\n"
            replacement_string_for_ordering += add_tabs(5) + "break;" + "\n"

            counter = counter + 1
        #}
        else:
        #{
            break
        #}
    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    ## https://note.nkmk.me/en/python-str-replace-translate-re-sub/
    ## https://regex101.com/
    with open("output_part_1/" + all_raw_data['code']['entityNameSingular'] + "ApiController.php", 'r+') as f:
        text = f.read()
        text = re.sub("class Menu", "class " + all_raw_data['code']['entityNameSingular'], text);

        # reference: ## https://note.nkmk.me/en/python-str-replace-translate-re-sub/
        text = re.sub("use App(.)Models(.)Menu", r'use App\1Models\2' + all_raw_data['code']['entityNameSingular'], text);

        text = re.sub("select\('id', 'name', 'url', 'icon', 'parent', 'display_order as Order'\)", all_raw_data['code']['selectClauseOfQueryForGrid'], text);
        text = re.sub("__WHERE_CONDITIONS_PLACEHOLDER__", replacement_string_for_where_conditions, text);
        text = re.sub("__SWITCH_CASE_CODE_PLACEHOLDER__", replacement_string_for_ordering, text);
        text = re.sub("Menu::", all_raw_data['code']['entityNameSingular'] + "::", text);
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_main_controller():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string_1 = ""
    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['database']['table_fields']:
    #{
        if(x['dataType'] == "longText"):
        #{
            replacement_string_1 += "\n"
            replacement_string_1 +=  add_tabs(4) + "/* references: https://laracasts.com/discuss/channels/laravel/base64-to-upload-image */\n"
            replacement_string_1 +=  add_tabs(4) + "/* https://laracasts.com/discuss/channels/laravel/how-to-save-image-as-blob */\n"
            replacement_string_1 +=  add_tabs(4) + "$newItem->"+x['name']+" = base64_encode(file_get_contents($request->file('"+x['name']+"')->getRealPath()));"
        #}
        else:
        #{
            replacement_string_1 +=  add_tabs(4) + "$newItem->"+x['name']+" = $request->"+x['name']+";"
        #}
        replacement_string_1 += "\n"
    #}
    # end of for loop

    replacement_string_2 = ""
    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['database']['table_fields']:
    #{
        if(x['dataType'] == 'longText'):
        #{
            replacement_string_2 += "\n"
            replacement_string_2 +=  add_tabs(4) + "/* references: https://laracasts.com/discuss/channels/laravel/base64-to-upload-image */\n"
            replacement_string_2 +=  add_tabs(4) + "/* https://laracasts.com/discuss/channels/laravel/how-to-save-image-as-blob */\n"
            replacement_string_2 +=  add_tabs(4) + "$data->"+x['name']+" = base64_encode(file_get_contents($request->file('"+x['name']+"')->getRealPath()));"
        #}
        else:
        #{
            replacement_string_2 +=  add_tabs(4) + "$data->"+x['name']+" = $request->"+x['name']+";"
        #}
        replacement_string_2 += "\n"
    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    ## https://note.nkmk.me/en/python-str-replace-translate-re-sub/
    ## https://regex101.com/
    with open("output_part_1/" + all_raw_data['code']['entityNameSingular'] + "Controller.php", 'r+') as f:
        text = f.read()
        text = re.sub("class MenuController", "class " + all_raw_data['code']['entityNameSingular'] + "Controller", text);
        text = re.sub("return view\('menus.", "return view('"+all_raw_data['code']['nameOfFolderContainingViews']+".", text);

        # reference: ## https://note.nkmk.me/en/python-str-replace-translate-re-sub/
        text = re.sub("use App(.)Models(.)Menu", r'use App\1Models\2' + all_raw_data['code']['entityNameSingular'], text);

        text = re.sub("Menu has been", all_raw_data['code']['entityNameSingular'] + " has been", text);
        text = re.sub("New menu has been", "New " + all_raw_data['code']['entityNameSingular'].lower() + " has been", text);
        text = re.sub("return redirect\(\)->route\('menus'\)", "return redirect()->route('"+all_raw_data['code']['entityNamePlural'].lower()+"')", text);
        text = re.sub("Menu::", all_raw_data['code']['entityNameSingular'] + "::", text);

        # reference: https://regex101.com/
        text = re.sub("\$newItem = new Menu;", "$newItem = new " + all_raw_data['code']['entityNameSingular'] + ";", text);

        text = re.sub("__PLACEHOLDER_1__", replacement_string_1, text);
        text = re.sub("__PLACEHOLDER_2__", replacement_string_2, text);
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_blade_file_for_view():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    replacement_string = ""

    # reference: https://www.w3schools.com/python/python_for_loops.asp
    for x in all_raw_data['ui_view_page_fields']:
    #{
        replacement_string += add_tabs(7) + "<tr>\n"
        replacement_string += add_tabs(8) + "<td>"+ x['label'] +"</td>\n"

        # ref: https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html
        if( x['dataType'] == "image" ):
        #{
            replacement_string += add_tabs(8) + "<!-- ref: https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html -->\n"
            replacement_string += add_tabs(8) + "<td><img style='width:300px;height:auto' src='data:image/jpeg;base64, {{ $data->"+ x['property_name'] +" }}' /> </td>\n"
        #}
        else: replacement_string += add_tabs(8) + "<td>{{ $data->"+ x['property_name'] +" }}</td>\n"

        replacement_string += add_tabs(7) + "</tr>\n"

    #}
    # end of for loop

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/view.blade.php", 'r+') as f:
        text = f.read()
        text = re.sub("url\(\'\/menus", "url('/" + all_raw_data['code']['nameOfFolderContainingViews'], text);
        text = re.sub("__PLACEHOLDER_1__", replacement_string, text)
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def change_web_php_file_snippet():
#{
    #references: https://stackoverflow.com/questions/4488570/how-do-i-write-a-tab-in-python
    ## https://stackoverflow.com/questions/2918362/writing-string-to-a-file-on-a-new-line-every-time

    global all_raw_data

    # reference: https://www.kite.com/python/answers/how-to-update-and-replace-text-in-a-file-in-python
    with open("output_part_1/web.php", 'r+') as f:
        text = f.read()

        # reference: ## https://note.nkmk.me/en/python-str-replace-translate-re-sub/
        ## https://regex101.com/
        text = re.sub("use App(.)Http(.)Controllers(.)Menu", r'use App\1Http\2Controllers\3'+ all_raw_data['code']['entityNameSingular'], text);
        text = re.sub("api/menus", "api/"+all_raw_data['code']['entityNamePlural'].lower(), text);
        text = re.sub("->name\('menus'\)", "->name('"+all_raw_data['code']['entityNamePlural'].lower()+"')", text);
        text = re.sub("Route::get\((.)*menus", r"Route::get(\1"+all_raw_data['code']['entityNamePlural'].lower(), text);
        text = re.sub("Route::post\((.)*menus", r"Route::post(\1"+all_raw_data['code']['entityNamePlural'].lower(), text);
        text = re.sub("Route::put\((.)*menus", r"Route::put(\1"+all_raw_data['code']['entityNamePlural'].lower(), text);
        text = re.sub("Route::delete\((.)*menus", r"Route::delete(\1"+all_raw_data['code']['entityNamePlural'].lower(), text);
        text = re.sub("MenuController", all_raw_data['code']['entityNameSingular']+"Controller", text);
        text = re.sub("MenuApiController", all_raw_data['code']['entityNameSingular']+"ApiController", text);
        f.seek(0)
        f.write(text)
        f.truncate()
#}

def move_output_files_to_source_code_location():
#{
    global migration_file_name
    global all_raw_data
    global operating_system

    web_app_source_code_path = all_raw_data['web_app_source_code_path']

    if(operating_system == "linux"):
    #{
        # references: https://stackabuse.com/executing-shell-commands-with-python/
        # https://www.geeksforgeeks.org/isupper-islower-lower-upper-python-applications/

        subprocess.run(["mv", "output_part_1/" + migration_file_name, web_app_source_code_path + "/database/migrations/" + migration_file_name])

        try:
        #{
            subprocess.run(["mkdir", web_app_source_code_path + "/resources/views/" + all_raw_data['code']['entityNamePlural'].lower()])
        #}
        except:
        #{
            print("exception")
        #}

        subprocess.run(["mv", "output_part_1/add.blade.php", web_app_source_code_path + "/resources/views/" + all_raw_data['code']['entityNamePlural'].lower() + "/add.blade.php"])
        subprocess.run(["mv", "output_part_1/edit.blade.php", web_app_source_code_path + "/resources/views/" + all_raw_data['code']['entityNamePlural'].lower() + "/edit.blade.php"])
        subprocess.run(["mv", "output_part_1/index.blade.php", web_app_source_code_path + "/resources/views/" + all_raw_data['code']['entityNamePlural'].lower() + "/index.blade.php"])
        subprocess.run(["mv", "output_part_1/view.blade.php", web_app_source_code_path + "/resources/views/" + all_raw_data['code']['entityNamePlural'].lower() + "/view.blade.php"])
        subprocess.run(["mv", "output_part_1/" + all_raw_data['code']['entityNameSingular'].lower() + ".js", web_app_source_code_path + "/public/custom/js/gridloading/" + all_raw_data['code']['entityNameSingular'].lower() + ".js"])
        subprocess.run(["mv", "output_part_2/" + all_raw_data['code']['entityNameSingular'].lower() + ".js", web_app_source_code_path + "/public/custom/js/validation/" + all_raw_data['code']['entityNameSingular'].lower() + ".js"])
        subprocess.run(["mv", "output_part_2/regex_definitions.js", web_app_source_code_path + "/public/custom/js/validation/regex_definitions.js"])
        subprocess.run(["mv", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + ".php", web_app_source_code_path + "/app/Models/" + all_raw_data['code']['entityNameSingular'] + ".php"])
        subprocess.run(["mv", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + "ApiController.php", web_app_source_code_path + "/app/Http/Controllers/" + all_raw_data['code']['entityNameSingular'] + "ApiController.php"])
        subprocess.run(["mv", "output_part_1/" + all_raw_data['code']['entityNameSingular'] + "Controller.php", web_app_source_code_path + "/app/Http/Controllers/" + all_raw_data['code']['entityNameSingular'] + "Controller.php"])
    #}
    elif(operating_system == "windows"):
    #{
        shutil.move("output_part_1\\" + migration_file_name, web_app_source_code_path + "\\database\\migrations\\" + migration_file_name)

        try:
        #{
            newpath = web_app_source_code_path + "\\" + "resources\\views\\" + all_raw_data['code']['entityNamePlural'].lower()
            if not os.path.exists(newpath):         # ref: https://stackoverflow.com/questions/1274405/how-to-create-new-folder
                os.makedirs(newpath)
            newpath = web_app_source_code_path + "\\" + "public\\custom"
            if not os.path.exists(newpath):
                os.makedirs(newpath)
            newpath = web_app_source_code_path + "\\" + "public\\custom\\js"
            if not os.path.exists(newpath):
                os.makedirs(newpath)
            newpath = web_app_source_code_path + "\\" + "public\\custom\\js\\gridloading"
            if not os.path.exists(newpath):
                os.makedirs(newpath)
            newpath = web_app_source_code_path + "\\" + "public\\custom\\js\\validation"
            if not os.path.exists(newpath):
                os.makedirs(newpath)
        #}
        except:
        #{
            print("exception")
        #}

        shutil.move("output_part_1\\add.blade.php", web_app_source_code_path + "\\resources\\views\\" + all_raw_data['code']['entityNamePlural'].lower() + "\\add.blade.php")
        shutil.move("output_part_1\\edit.blade.php", web_app_source_code_path + "\\resources\\views\\" + all_raw_data['code']['entityNamePlural'].lower() + "\\edit.blade.php")
        shutil.move("output_part_1\\index.blade.php", web_app_source_code_path + "\\resources\\views\\" + all_raw_data['code']['entityNamePlural'].lower() + "\\index.blade.php")
        shutil.move("output_part_1\\view.blade.php", web_app_source_code_path + "\\resources\\views\\" + all_raw_data['code']['entityNamePlural'].lower() + "\\view.blade.php")
        shutil.move("output_part_1\\" + all_raw_data['code']['entityNameSingular'].lower() + ".js", web_app_source_code_path + "\\public\\custom\\js\\gridloading\\" + all_raw_data['code']['entityNameSingular'].lower() + ".js")
        shutil.move("output_part_2\\" + all_raw_data['code']['entityNameSingular'].lower() + ".js", web_app_source_code_path + "\\public\\custom\\js\\validation\\" + all_raw_data['code']['entityNameSingular'].lower() + ".js")
        shutil.move("output_part_2\\regex_definitions.js", web_app_source_code_path + "\\public\\custom\\js\\validation\\regex_definitions.js")        
        shutil.move("output_part_1\\" + all_raw_data['code']['entityNameSingular'] + ".php", web_app_source_code_path + "\\app\\Models\\" + all_raw_data['code']['entityNameSingular'] + ".php")
        shutil.move("output_part_1\\" + all_raw_data['code']['entityNameSingular'] + "ApiController.php", web_app_source_code_path + "\\app\\Http\\Controllers\\" + all_raw_data['code']['entityNameSingular'] + "ApiController.php")
        shutil.move("output_part_1\\" + all_raw_data['code']['entityNameSingular'] + "Controller.php", web_app_source_code_path + "\\app\\Http\\Controllers\\" + all_raw_data['code']['entityNameSingular'] + "Controller.php")

    #}


#}


# references:
# https://flask.palletsprojects.com/en/1.1.x/quickstart/#a-minimal-application
# https://flask.palletsprojects.com/en/1.1.x/quickstart/#http-methods
@app.route('/api/generate_code', methods=['POST'])
def main():
#{
    global all_raw_data
    global operating_system

    data = request.json             # ref: https://stackoverflow.com/questions/20001229/how-to-get-posted-json-in-flask
    # print(data)

    all_raw_data = data
    operating_system = all_raw_data["operating_system"]

    copy_template_files()
    rename_output_files()
    change_migration_file()
    change_blade_file_for_add()
    change_blade_file_for_edit()
    change_blade_file_for_index()
    change_js_file_for_datatable()
    change_js_file_for_form_validation()
    change_model()
    change_api_controller()
    change_main_controller()
    change_blade_file_for_view()
    change_web_php_file_snippet()
    move_output_files_to_source_code_location()

    return_object = {}                                      # ref: https://www.w3schools.com/python/python_dictionaries.asp
    return_object["message"] = "Operation successful. Please check your target application and run the scaffolded code."
    return_object["response_code"] = 200

    return return_object            # ref: https://stackoverflow.com/questions/13081532/return-json-response-from-flask-view
#}
