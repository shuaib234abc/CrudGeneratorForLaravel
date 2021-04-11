<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      return view('menus.index');

    }

    /**
     * Show the form for adding a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showAddNewForm()
    {
        return view('menus.add');
    }

    /**
     * Store a newly added resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeNew(Request $request)
    {
        //credits: https://www.tutsmake.com/laravel-8-crud-example-tutorial/

        $newItem = new Menu;
__PLACEHOLDER_1__        
        $newItem->save();
        return redirect()->route('menus')
        ->with('success','New menu has been added successfully.');

        //credits: https://laracasts.com/discuss/channels/laravel/redirect-route-is-not-working-why
    }

    public function showInViewMode($id)
    {
        $data = Menu::findOrFail($id);
        return view('menus.view', compact('data'));
    }

    public function showInEditMode($id)
    {
        $data = Menu::findOrFail($id);

        return view('menus.edit', compact('data'));
    }

    public function update(Request $request, $id)
    {
        $data = Menu::findOrFail($id);
__PLACEHOLDER_2__ 
        $data->save();
        return redirect()->route('menus')
        ->with('success','Menu has been updated successfully.');

    }

    public function delete($id)
    {
        $data = Menu::findOrFail($id);

        //credits: https://www.itsolutionstuff.com/post/laravel-8-crud-application-tutorial-for-beginnersexample.html
        $data->delete();

        $output = new \stdClass();
        $output->statusText = "Menu has been deleted successfully";

        return response()->json($output);
    }
}
