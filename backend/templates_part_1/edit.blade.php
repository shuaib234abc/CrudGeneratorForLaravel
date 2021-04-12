@extends('layouts.main')

@section('content')

<!-- credits:
https://www.itsolutionstuff.com/post/laravel-8-crud-application-tutorial-for-beginnersexample.html
https://www.techiediaries.com/laravel-8-crud-tutorial/
https://www.tutsmake.com/laravel-8-crud-example-tutorial/
-->

<!--
The UI theme for this application has been taken from CoreUI (https://coreui.io) ... below are some
license and copyright related information regarding CoreUI

* CoreUI - Free Bootstrap Admin Template
* @version v4.0.0-alpha.2
* @link https://coreui.io
* Copyright (c) 2021 creativeLabs Lukasz Holeczek
* Licensed under MIT (https://coreui.io/license)

-->

<div class="row">
  <div class="col-sm-12">
    <div class="float-right" style="margin-bottom:4%">
        <a href="{{ url('/menus') }}" title="Back"><button class="btn btn-info">Back</button></a>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-sm-12 col-lg-12">

    <form id="this-form" name="this-form" action="{{ url('/menus' . '/' . $data->id) }}" method="POST" enctype="multipart/form-data">
          <!-- credits: https://www.itsolutionstuff.com/post/laravel-8-crud-application-tutorial-for-beginnersexample.html -->
          @method('PUT')
          @csrf
          <div class="row">
              
--PLACEHOLDER_FORM_FIELDS--              

              <button type="submit" class="btn btn-primary">Submit</button>
        </div>
    </form>

  </div>
  <!-- /.col-->
</div>
<!-- /.row-->

@stop

@section('custom_script')

<script src="{{ URL::asset('custom/js/validation/regex_definitions.js') }}"></script>
<script src="{{ URL::asset('custom/js/validation/menu.js') }}"></script>

@stop
