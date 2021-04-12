@extends('layouts.main')

@section('content')

<div class="row">
  <div class="col-sm-12 col-lg-12">


    <div id="div_deleteNotification" class="alert alert-success alert-invisible">
        <p>PLACEHOLDER_ENTITY_NAME_SINGULAR has been deleted successfully. The grid below will reload momentarily.</p>
    </div>

    <!--
    credits: https://www.tutsmake.com/laravel-8-crud-example-tutorial/
    -->

    @if ($message = Session::get('success'))
    <div class="alert alert-success">
    <p>{{ $message }}</p>
    </div>
    @endif
    <!-- credits: https://www.tutsmake.com/laravel-8-crud-example-tutorial/ -->

    <div class="float-right" style="margin-bottom:4%">
      <a href="{{ url('/menus/show-add-new-form') }}" title="Add new"><button class="btn btn-info">Add new</button></a>
    </div>

    <div id="gridContainer">
                        <table id="table_existingRecords" class="display select" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                  <th>ID</th>
__PLACEHOLDER_TABLE_FIELDS__                                
                                  <th>Action</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                  <th>ID</th>
__PLACEHOLDER_TABLE_FIELDS__
                                  <th>Action</th>
                                </tr>
                            </tfoot>
                        </table>
    </div>

    <!--

  -->

  </div>
  <!-- /.col-->
</div>
<!-- /.row-->

@stop

@section('custom_script')

<script src="{{ URL::asset('custom/js/gridloading/menu.js') }}"></script>

@stop
