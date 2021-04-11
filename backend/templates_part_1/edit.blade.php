@extends('layouts.main')

@section('content')

<!-- credits:
https://www.itsolutionstuff.com/post/laravel-8-crud-application-tutorial-for-beginnersexample.html
https://www.techiediaries.com/laravel-8-crud-tutorial/
https://www.tutsmake.com/laravel-8-crud-example-tutorial/
-->

<div class="row">
  <div class="col-sm-12">
    <div class="float-right" style="margin-bottom:4%">
        <a href="{{ url('/menus') }}" title="Back"><button class="btn btn-info btn-sm">Back</button></a>
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

              <button type="submit" class="btn btn-primary ml-3">Submit</button>
        </div>
    </form>

  </div>
  <!-- /.col-->
</div>
<!-- /.row-->

@stop

@section('custom_script')

<script src="{{ URL::asset('custom/js/validation/menu.js') }}"></script>

@stop
