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

let html_numeric_view = null;

var numeric_view_not_initialised = true;

/*---------------------------------------------------------------------------*/
function initialiseNumericView ()
{
    $("#numeric-list").empty();
    html_numeric_view = $("#numeric-list").editTable({data: [["5","5"]],
                                                      headerCols: ['X','Y'],
                                                      maxRows: 150});
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.setNumericViewEventHandlers = function ()
{
    var view = numeric_view;

    $("#numeric-list input").on("focus",
                                (event)=>
                                {
                                 if (view.table.isBeingEdited ())
                                            view.table.stopEditing();
                                 view.table.valuesEditedBy (view,
                                                          $(event.target).closest('tr').attr("index"));
                                });

    $("#numeric-list tbody tr").hover ((event) =>
                                        {
                                            var tr = $(event.target).closest('tr');
                                            var index = tr.attr("index");
                                            view.table.highlightOtherViews (view, index);
                                        },
                                        (event) =>
                                        {
                                            var index = $(event.target).closest('tr').attr("index");
                                            view.table.stopOthersHighlight (view, index);
                                        } );
}


/*---------------------------------------------------------------------------*/
function NumericView ()
{

    this.table = null;
    this.index_highlighted = -1

    if (numeric_view_not_initialised)
    {
        initialiseNumericView();
        numeric_view_not_initialised = false;
    }

    var me = this;
    $("#numeric-list").on('change', //'input',
                          function () {me.changeTableValues();});
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.getInputsAtIndex = function (index)
{
    var selector = '#numeric-list tr[index="'+index+'"] input';
    return $(selector);
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.getRowAtIndex = function (index)
{
    var selector = '#numeric-list tr[index="'+index+'"]';
    return $(selector);
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.connectTable = function (table2d)
{
    var display_table = [];
    var steps = [];

    if (this.table != null && this.table != table2d) this.table.releaseViews();

    this.table = table2d;

    // Create the visible table
    for (var i in table2d.x)
    {
        display_table.push ([table2d.x[i], table2d.y[i]]);
    }

    steps.push ((table2d.x_axis.max - table2d.x_axis.min)/100.0);
    steps.push ((table2d.y_axis.max - table2d.y_axis.min)/100.0);
    html_numeric_view.loadData(display_table, steps);
    this.setNumericViewEventHandlers ();
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.reactToUpdatedTable = function ()
{
    var display_table = [];
    var steps =[];

    for (var i in this.table.x)
    {
        display_table.push ([this.table.x[i], this.table.y[i]]);
    }
    steps.push ((this.table.x_axis.max - this.table.x_axis.min)/100.0);
    steps.push ((this.table.y_axis.max - this.table.y_axis.min)/100.0);
    html_numeric_view.loadData(display_table, steps);
    this.setNumericViewEventHandlers ();
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.reactToUpdatedValue = function (index)
{
    var X = 0;
    var me = this;

    elements = this.getInputsAtIndex (index);
    elements.each (function (coord){
                             if (coord == X) $( this ).attr({value:me.table.x[index]});
                             else $( this ).attr({value:me.table.y[index]});
                            });
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.reactToUnitsChange = function ()
{
    this.reactToUpdatedTable();
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.changeTableValues = function ()
{
    var output_table = html_numeric_view.getData();
    var new_x_table =[];
    var new_y_table =[]

    for (var i in output_table)
    {
        new_x_table.push (parseFloat(output_table[i][0]));
        new_y_table.push (parseFloat(output_table[i][1]));
    }
    this.table.valuesReplacedBy (this, new_x_table, new_y_table);

    this.setNumericViewEventHandlers ();
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.scrollToRow = function (row)
{
    var new_pos = $(row)[0].offsetTop
                  -
                  $(row).closest("div")[0].offsetTop;

    $("#numeric-list")[0].scrollTo({top:new_pos,
                                    left: 0,
                                    behavior: 'smooth'});
}


/*---------------------------------------------------------------------------*/
NumericView.prototype.reactToEdition = function (index_of_edited_value)
{
    var row = this.getRowAtIndex (index_of_edited_value);
    row.attr ({style:'background:#AAFFAA; color:black'});
    this.scrollToRow(row);
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.stopEditing = function ()
{
    var index = this.table.index_edited;

    var row = this.getInputsAtIndex (index);
    if (index != this.index_highlighted)
        row.attr ({style:'background:""; color:white'});
    else
        row.attr ({style:'background:#A0A0F0; color:white'});
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.reactToExternalHighlight = function (index)
{
    var row = null;

    if (this.index_highlighted != -1)
    {
        row = this.getRowAtIndex (this.index_highlighted);
        row.attr ({style:'background:""; color:white'});
    }

    row = this.getRowAtIndex (index);
    row.attr ({style:'background:#A0A0F0 ; color:white'});
    this.scrollToRow(row);
    this.index_highlighted = index;
}

/*---------------------------------------------------------------------------*/
NumericView.prototype.stopExternalHighlight = function (index)
{
    //elements = this.getInputsAtIndex (index);
    //elements.attr ({style:'background:""'});
}