# CRUD Generator for Laravel

It is a lengthly task to create even a CRUD functionality in Laravel. This is a small application where you just specify some information about your entity, and all the relevant code files for CRUD functionality are automatically generated!.
This project was implemented using Python and Angular 11.

## Features 
1. Full CRUD functionality (View data in grid, view single, add, edit, delete)
2. Nice looking data grid with server side pagination
3. Form validation
4. Bootstrap used
5. Easy to use interface ... just specify some information about your entity in a form and submit
6. Plug and play ... the scaffolded files are copied to your target Laravel project automatically

## What is scaffolded?
1. Controller
2. Model
3. Migration class
4. Blade templates for add, edit, 'view single' and 'view data in grid'
5. Data grid is populated using jQuery datatables (https://datatables.net) with server side pagination. The javascript code for datatables is scaffolded.
6. The form validation in add and edit page is performed using (https://jqueryvalidation.org). The javascript code for validation is scaffolded.

## Pre-requisites for running this app

1. Angular CLI (This project used Angular 11)
2. Python 3.x
3. Flask framework (https://flask.palletsprojects.com/en/1.1.x/)
4. Make sure the ports 4200 and 5000 are free. These are used by the Angular and Python app, respectively. If any port is not free, you can specify an alternative port when running the application.

## Running the app

1. Clone the repository.
2. Navigate to <project directory>/backend using the command line
3. python -m flask run
4. Navigate to <project directory>/frontend using the command line
5. npm install
6. npm serve
7. Open your browser to `http://localhost:4200/`
8. Fill up the form as per your Laravel application CRUD requirements
9. Submit the form
10. If the form is submitted successfully, check the Laravel application folder and see if the new files have been generated.
11. The scaffolding application assumes that your target Laravel application is using a common template for all CRUD pages. The generated blade files will extend from main.blade.php in <laravel app>/resources/views/layouts/
12. The common blade template should have a `@yield('content')`  (for displaying the HTML)  and a `@yield('custom_script')`   (for the custom Javascript code)
13. This is how a generated blade file looks like

```blade

@extends('layouts.main')

@section('content')

<p All scaffolded html goes here </p>

@stop

@section('custom_script')

<script src="{{ URL::asset('custom/js/validation/menu.js') }}"></script>

@stop

```

## How the application works

1. The templates for the scaffolded code are in <project directory>/backend/templates_part_1 and <project directory>/backend/templates_part_2 folder.
2. After the user submits the form specifying information about the CRUD pages, find-and-replace strategy is used to edit the template files.
3. After all files are edited, they are copied to the target Laravel project directory specified by the user.
4. Laravel has a well-formed directory structure, so the app knows where to put each file.

## Third party libraries

- For the main application, Angular 11 (https://angular.io) and Python 3 (https://www.python.org) have been used.
- Core UI Boostrap Admin template (https://github.com/coreui/coreui-free-bootstrap-admin-template) has been used for the UI/UX design in the scaffolded code. Core UI is under MIT license.
- Other libraries used for the scaffolded code
- 1. jQuery 3.5.1 ( https://jquery.com/ ) ... MIT license
- 2. jQuery validation plugin 1.19.2 ( https://github.com/jquery-validation/jquery-validation ) ... MIT license
- 3. jQuery datatables 1.10.22 (https://datatables.net/) ... MIT license

## References / Attribution

1. Reactive forms design and validation
    https://www.freecodecamp.org/news/how-to-validate-angular-reactive-forms/

2. Getting started with Python Flask framework
    https://flask.palletsprojects.com/en/1.1.x/quickstart/#a-minimal-application

3. Working with HTTP POST requests in Flask
    https://flask.palletsprojects.com/en/1.1.x/quickstart/#http-methods

4. Working with HTTP POST requests in Angular
    https://angular.io/guide/http
    https://medium.com/techiediaries-com/send-http-post-with-angular-9-8-httpclient-by-example-61e2dfdee8a9

5. CORS requests in Flask
    https://flask-cors.readthedocs.io/en/latest/

6. Regular expressions have been heavilly used in this project. I have learnt a lot about regular expressions from
    https://regex101.com/    

