<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

//credits:
//          https://laravel.com/docs/8.x/migrations
//          https://www.techiediaries.com/laravel-8-crud-tutorial/
//          https://laravel.com/docs/4.2/schema

class --placeholder_class_name-- extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('--placeholder_table_name--', function (Blueprint $table) {
            $table->id();
            --- PLACEHOLDER_FIELDS ---
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('--placeholder_table_name--');
    }
}
