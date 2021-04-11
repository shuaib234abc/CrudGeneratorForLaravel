use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuApiController;

Route::get('menus', [MenuController::class, 'index'])->name('menus');
Route::get('api/menus', [MenuApiController::class, 'index']);
Route::get('menus/show-add-new-form', [MenuController::class, 'showAddNewForm']);
Route::post('menus/store-new', [MenuController::class, 'storeNew']);
Route::get('menus/{id}/view', [MenuController::class, 'showInViewMode']);
Route::get('menus/{id}/edit', [MenuController::class, 'showInEditMode']);
Route::put('menus/{id}', [MenuController::class, 'update']);
Route::delete('menus/{id}', [MenuController::class, 'delete']);
