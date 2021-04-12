<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use App\Viewmodels\DatatableNavigationParams;
//use URL;

class MenuApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      //references: https://stackoverflow.com/questions/30942556/laravel-dynamic-where-clause-with-elouquent
      //https://laravel.com/docs/8.x/eloquent

      $datatableNavigationParams = $this->getNavigationParameters($request);

      $query = Menu::query();
      $query = $query->select('id', 'name', 'url', 'icon', 'parent', 'display_order as Order');

      if($datatableNavigationParams->searchBoxValue != null && $datatableNavigationParams->searchBoxValue != ""){

        //references: https://stackoverflow.com/questions/30761950/laravel-5-like-equivalent-eloquent
__WHERE_CONDITIONS_PLACEHOLDER__
      }

      $query_for_filtered_count = $query;
      $filtered_count = $query_for_filtered_count->count();

      $order = $datatableNavigationParams->order;
      $orderDir = $datatableNavigationParams->orderDir;

      //references: https://www.w3schools.com/php/php_switch.asp
      // https://laravel.com/docs/8.x/queries#raw-expressions
      switch($order){
__SWITCH_CASE_CODE_PLACEHOLDER__        
      }

      //references: // https://laravel.com/docs/8.x/queries#raw-expressions
      if(
        $datatableNavigationParams->pageSize != null
        && $datatableNavigationParams->pageSize != ""
        && $datatableNavigationParams->pageSize != -1)
      {
        $query = $query->skip($datatableNavigationParams->startRec)->take($datatableNavigationParams->pageSize);
      }
      $data = $query->get();

      $outputForDatatable = new \stdClass();
      $outputForDatatable->draw = $datatableNavigationParams->draw;

      $outputForDatatable->recordsTotal = Menu::where('id', '>', 0)->count();
      $outputForDatatable->recordsFiltered = $filtered_count;

      $outputForDatatable->data = $data;

      return response()->json($outputForDatatable);

    }

    //common method
    protected function getNavigationParameters(Request $request)
    {
      $datatableNavigationParams = new \stdClass();
      $datatableNavigationParams->draw = "";
      $datatableNavigationParams->order = "";
      $datatableNavigationParams->orderDir = "";
      $datatableNavigationParams->startRec = "";
      $datatableNavigationParams->pageSize = "";
      $datatableNavigationParams->searchBoxValue = "";

      //references: https://www.codegrepper.com/code-examples/php/laravel+get+all+request+parameters
      $allGetParams = $request->all();

      //references: https://stackoverflow.com/questions/38737019/laravel-5-2-get-query-string
      if ($request->has('draw')) {
       $datatableNavigationParams->draw = $request->input('draw');
      }
      if ($allGetParams['order'] != null
          && $allGetParams['order'][0] != null
          && $allGetParams['order'][0]['column'] != null) {
       $datatableNavigationParams->order = $allGetParams['order'][0]['column'];
      }
      if ($allGetParams['order'] != null
          && $allGetParams['order'][0] != null
          && $allGetParams['order'][0]['dir'] != null) {
       $datatableNavigationParams->orderDir = $allGetParams['order'][0]['dir'];
      }
      if ($request->has('start')) {
       $datatableNavigationParams->startRec = $request->input('start');
      }
      if ($request->has('length')) {
       $datatableNavigationParams->pageSize = $request->input('length');
      }
      if ($allGetParams['search'] != null
          && $allGetParams['search']['value'] != null) {
       $datatableNavigationParams->searchBoxValue = $allGetParams['search']['value'];
      }

      return $datatableNavigationParams;

    }

}
