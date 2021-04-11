jQuery(document).ready(function() {

                //references: https://laracasts.com/discuss/channels/laravel/how-to-fix-csrf-token-mismatch-for-patch-ajax-request-2nd-time
                $.ajaxSetup({
                    headers: {
                      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });


                //references: // credits: https://www.c-sharpcorner.com/article/jquery-datatable-server-side-processing-with-custom-operations/

                var table_existingRecords = null;

                table_existingRecords = $('#table_existingRecords').DataTable({
                    'ajax': '/api/menus',
                    "processing": true,
                    "serverSide": true,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    "columns": [

                        /* references: https://datatables.net/examples/basic_init/hidden_columns.html */
                        {
                            "data" : "id",
                            "visible": false,
                            "searchable": false
                        },

__FIELDS__

                        /* references: https://datatables.net/examples/ajax/null_data_source.html */
                        {
                            "targets": -1,
                            "data": null,
                            "defaultContent": "<a id='gridInlineViewLink' title=\"View\"><button id='gridInlineViewBtn' class=\"btn btn-success btn-sm\">View</button></a>&nbsp;<a id='gridInlineEditLink' title=\"Edit\"><button id='gridInlineEditBtn' class=\"btn btn-primary btn-sm\">Edit</button></a>&nbsp;<a id='gridInlineDeleteLink' title=\"Delete\"><button id='gridInlineDeleteBtn' class=\"btn btn-danger btn-sm\">Delete</button></a>"
                        }
                    ],
                    'order': [[1, 'asc']],
                    'initComplete': function () {
                        var input = $('.dataTables_filter input').unbind(),
                            self = this.api(),
                            $searchButton = $('<button>')
                                .text('search')
                                .click(function () {
                                    var tmp = ($("#table_existingRecords_filter input[type=search]").val());
                                    //var tmp = input.val();
                                    self.search(tmp).draw();
                                }),
                            $clearButton = $('<button>')
                                .text('clear')
                                .click(function () {
                                    $("#table_existingRecords_filter input[type=search]").val('');
                                    $searchButton.click();
                                })
                        $('.dataTables_filter').append($searchButton, $clearButton);
                    }
                });

                /* references: https://datatables.net/examples/ajax/null_data_source.html */
                $('#table_existingRecords tbody').on( 'click', 'button', function () {
                    var data = table_existingRecords.row( $(this).parents('tr') ).data();

                    var url = window.location.href;

                    /* references: https://forum.jquery.com/topic/get-id-of-current-element */
                    var idOfButton = $(this).attr('id');

                    if(idOfButton == "gridInlineViewBtn"){
                      url = url + "/" + data['id'] + "/view";
                      window.location.replace(url);
                    }
                    else if(idOfButton == "gridInlineEditBtn"){
                      url = url + "/" + data['id'] + "/edit";
                      window.location.replace(url);
                    }
                    else if(idOfButton == "gridInlineDeleteBtn"){

                      url = url + "/" + data['id'];

                      if(confirm("Confirm deletion?")){

                        //reference: https://stackoverflow.com/questions/2153917/how-to-send-a-put-delete-request-in-jquery/2153931
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function(result) {

                                $("#div_deleteNotification").removeClass("alert-invisible");
                                setTimeout(function(){
                                  window.location.reload();
                                }, 3000);

                            }
                        });
                      }
                    }


                } );



});
