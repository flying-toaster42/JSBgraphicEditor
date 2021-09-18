// This file is part of JSB graphic editor.

// JSB graphic editor is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// JSB graphic editor is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with JSB graphic editor.  If not, see <https://www.gnu.org/licenses/>.

var FDM = {};
var xmlDoc = {};

var tree_view = [];
var tables_view =[];
var tree_id_number = 1;

var tables = [];
var saveable_data = [];

/* file dialog ************************************************************** */
function fileOpenDialog ()
{
   var file_path = window.API.getFileNameToOpen();
   if (file_path != undefined) return file_path[0];
   else return "";
}

/* file dialog ************************************************************** */
function fileSaveDialog ()
{
   var file_path = window.API.getFileNameToSave();
   if (file_path != undefined) return file_path[0];
   else return "";
}

/* -------------------------------------------------------------------------- */
var parent_table_counter = 0;

function recurseTreeView (xml_tree, root_tree_view)
{
    var children = $(xml_tree).children();
    var keep = true;

    var number_of_children = children.length;
    if (number_of_children > 0)
    {

        for (var index = 0; index < number_of_children; index++)
        {
            var tag_name = $(children[index]).prop("tagName");
            var identification = "JSBtree-"+tree_id_number;
            switch (tag_name)
            {
                case "function":
                    var text = '<img src="icons/func.png"> '+ $(children[index]).attr("name");
                    parent_table_counter = 0;
                break;
                case "property":
                    var text = '<img src="icons/prop.png"> '+ $(children[index]).text();
                break;
                case "value":
                    var text = tag_name +" : "+ $(children[index]).text();
                break;
                case "table":
                    var parent_function = $(children[index]).closest("function");
                    if (parent_function.length >1) alert ("more than one parent function !");
                    parent_table_counter++;
                    var table = createTable (children[index], parent_table_counter);
                    saveable_data.push (table);

                    if (table instanceof Table2D)
                    {
                        tables.push(table);
                        //var text = '<img src="icons/curve.png"> ';
                        var text = '<img src="icons/curve.png"> '+ table.name;
                        tables_view.push ({"text" : text,
                                            table_index : tables.length - 1,
                                            reference_node : identification});
                    }
                    else
                    {
                        var text = '<img src="icons/3D.png"> '+table.name;
                        let view_children = [];
                        for (subtable of table.tables)
                        {
                            tables.push (subtable);
                            var table_text = '<img src="icons/curve.png"> '+subtable.name;
                            view_children.push ({"text" : table_text,
                                                 table_index : tables.length - 1,
                                                 reference_node : identification});
                        }
                        tables_view.push ({"text" : '<img src="icons/3D.png"> '+table.name,
                                           table_index : -1,
                                           reference_node : identification,
                                           children : view_children});
                    }
                break;
                case "independentVar":
                    var text = '<img src="icons/prop.png"> '+ $(children[index]).text();
                break;
                case "sum":
                    var text = '<img src="icons/add.png">';
                break;
                case "product":
                    var text = '<img src="icons/mul.png">';
                break;
                case "quotient":
                    var text = '<img src="icons/qot.png">';
                break;
                case "difference":
                    var text = '<img src="icons/sub.png">';
                break;
                case "description":
                    var text = $(children[index]).text();
                break;
                case "tableData":
                    keep = false;
                break;
                default : var text = tag_name;
            }
            if (keep)
            {
                var new_child = {"text" :text,
                                children :[],
                                id : identification};
                tree_id_number ++;
                root_tree_view.children.push (new_child);
                recurseTreeView (children[index], new_child);
            }
        }
    }
}

/* -------------------------------------------------------------------------- */
function loadJSB ()
{
    var filepath = fileOpenDialog ();

    if (filepath.length == 0) return;

    var filename = filepath.split('\\').pop().split('/').pop();

    if (filename.split('.').pop()!='xml') return;

    $("#file-name").text(filename);

    var text = window.API.XMLfileToString (filepath);

    // clean up previous data
    $('#tree').jstree('destroy');
    $('#tree').empty();
    $('#tables-list').jstree('destroy');
    $('#tables-list').empty();
    tree_view = [];
    tables_view = [];
    tree_id_number = 1;

    //remove the main placeholder in case of success
    $("#central-pane").show(0);
    $("#central-placeholder").hide(0);
    $("#graphic-placeholder").hide(0);
    $("#graphic-area").show(0);
    if (curve1 !=null) curve1.hide();

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");

    level1 =$(xmlDoc).children();

    var root = {"text" : $(level1).attr("name"), children : []};
    tree_view.push (root);

    tables = [];
    recurseTreeView (level1, root);

    var file_tree = $('#tree').jstree({core:{data :tree_view,
                                             'themes' : {'name' : "default-dark",
                                                        'icons': false}},
                                       "plugins" : ["themes"]});



    var tables_tree = $('#tables-list').jstree({core:{data :tables_view,
                                                      'themes' : {'name' : "default-dark",
                                                                  'icons': false}},
                                                "plugins" : ["themes"]});
    tables_tree.on ("select_node.jstree",
                    function (e, data)
                    {
                        if (curve1 == null)
                        {
                            curve1 = new Curve ("#curve", "#curve-title", "#buttons");
                            numeric_view = new NumericView();
                            curve1.resize();
                        }
                        if (data.selected.length == 1)
                        file_tree.jstree('deselect_node', file_tree.jstree("get_selected"));
                        file_tree.jstree('select_node', data.node.original.reference_node);

                        var new_pos = $("#"+data.node.original.reference_node)[0].offsetTop
                                      -
                                      $("#"+data.node.original.reference_node).closest("div")[0].offsetTop;

                        $('#tree')[0].scrollTo({top:new_pos,
                                                left: 0,
                                                behavior: 'smooth'});

                        if (data.node.original.table_index != -1)
                                tables [data.node.original.table_index].associate (curve1, numeric_view);
                        else curve1.hide();

                    });
    central_pane.resize ();
    window.API.setFileIsSaved (true);
    window.API.fileLoaded (filepath);
}

/* -------------------------------------------------------------------------- */
function saveAsJSB ()
{
    var filepath = fileSaveDialog ();

    if (filepath.length == 0) return;

    for (data of saveable_data)
    {
        data.storeBackInXML();
    }
    var s = new XMLSerializer();
    var str = s.serializeToString(xmlDoc);
    window.API.XMLStringToFile (str, filepath);
    window.API.setFileIsSaved (true);
}

/* -------------------------------------------------------------------------- */
function saveJSB ()
{

    for (data of saveable_data)
    {
        data.storeBackInXML();
    }
    var s = new XMLSerializer();
    var str = s.serializeToString(xmlDoc);
    window.API.fileSave(str);
    window.API.setFileIsSaved (true);
}