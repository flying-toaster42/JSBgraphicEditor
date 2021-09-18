
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

/* ************************************************************************* */
/* 2D tables */

/* ************************************************************************* */
/* Constructors */

function TableAxis ()
{
    this.min = Infinity;
    this.max = - Infinity;
    this.name = "";
    this.unit = new UnitManager();
}

function Table2D ()
 {
    this.name = "";
    this.parent_name = "";
    this.XML_source = null;
    this.altered = false;
    this.x = [];
    this.y = [];
    this.x_axis = new TableAxis ();
    this.y_axis = new TableAxis ();
    this.views = []; //views should implement a tableUpdated() method
                     // Not strictly an MVC since table and curve views each
                     // Have different controllers
    this.index_edited = -1;
    this.index_highlighted = -1;
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.insertInterpolation = function (value)
{

    if (value <= this.x[0])
    {
        this.x.splice (0,0,value);
        this.y.splice (0,0,this.y[0]);
        return;
    }

    if (value > this.x[this.x.length-1])
    {
        this.x.push (value);
        this.y.push (this.y[this.y.length-1]);
        return;
    }

    for (var index = 0;
         index < this.x.length-1;
         index ++)
    {
        if (value> this.x[index]
            &&
            value< this.x[index+1])
            {
                this.x.splice (index+1, 0, value);
                this.y.splice (index+1, 0, this.y[index]
                                         +
                                         (this.y[index+1]
                                          -
                                          this.y[index])
                                          *
                                          (value
                                           -
                                           this.x[index])
                                          /
                                          (this.x[index+1]
                                           -
                                           this.x[index]));
                return;
            }
    }
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.fillFromText = function (text_data)
{

    var lines = text_data.split ('\n');
    for (line of lines)
    {
        line = line.trim();
        if (line != '')
        {
            values = line.split (/\s+/);
            new_x = parseFloat (values [0]);
            new_y = parseFloat (values [1]);
            this.x.push (new_x);
            this.y.push (new_y);
            if (this.x_axis.min > new_x) this.x_axis.min = new_x;
            if (this.x_axis.max < new_x) this.x_axis.max = new_x;
            if (this.y_axis.min > new_y) this.y_axis.min = new_y;
            if (this.y_axis.max < new_y) this.y_axis.max = new_y;
        }
    }
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.fill = function (xml_input)
{
    this.XML_source = $(xml_input).find ("tableData").first();
    var text_data =  this.XML_source.text();

    this.fillFromText (text_data);
}

/* ************************************************************************* */
/* Views management */

/*---------------------------------------------------------------------------*/
Table2D.prototype.associate = function (...views)
{
    this.views = [];

    this.altered = false;
    var me = this;
    for (view of views)
    {
        this.views.push (view);
        view.connectTable (me);
    }
    this.resetUnitSelection();
}
/*---------------------------------------------------------------------------*/
Table2D.prototype.releaseViews = function (...views)
{
    this.views = [];
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.isBeingEdited = function ()
{
  return this.index_edited !=-1;
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.highlightOtherViews = function (origin, index_of_highlighted_value)
{
    for (var current_view of this.views)
    {
        if (current_view != origin)
         current_view.reactToExternalHighlight(index_of_highlighted_value);
    }
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.stopOthersHighlight = function (origin, index)
{
    for (var current_view of this.views)
    {
        if (current_view != origin)
            current_view.stopExternalHighlight(index);
    }
}


/*---------------------------------------------------------------------------*/
Table2D.prototype.valuesEditedBy = function (view_making_the_edition, index_of_edited_value)
{
    for (var current_view of this.views)
    {
        if (current_view != view_making_the_edition)
            current_view.reactToEdition(index_of_edited_value);
    }
    this.index_edited = index_of_edited_value;
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.stopEditing = function (who_was_editing)
{
    for (var current_view of this.views)
    {
        if (current_view != who_was_editing)
            current_view.stopEditing();
    }
    this.index_edited = -1;
}

/* ************************************************************************* */
/* Edition methods */

/*---------------------------------------------------------------------------*/
Table2D.prototype.getCloneOfX = function ()
{
  return Array.from (this.x);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.getCloneOfY = function ()
{
  return Array.from (this.x);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.refreshOtherViews = function (view_making_the_modification)
{
    for (var current_view of this.views)
    {
        if (current_view != view_making_the_modification)
        current_view.reactToUpdatedTable();
    }
}

Table2D.prototype.resetBounds = function (view_making_the_modification)
{
    this.x_axis.min = Math.min(...this.x);
    this.x_axis.max = Math.max(...this.x);
    this.y_axis.min = Math.min(...this.y);
    this.y_axis.max = Math.max(...this.y);
    this.index_edited = -1;
    this.altered = true;
    this.refreshOtherViews (view_making_the_modification);
}

/*---------------------------------------------------------------------------*/
/* replacement of all values */

/*---------------------------------------------------------------------------*/
Table2D.prototype.valuesReplacedByDirect = function (view_making_the_modification,
                                                     new_x_array,
                                                     new_y_array)
{
    //TODO : add sanity checks
    this.x = new_x_array;
    this.y = new_y_array;
    this.resetBounds (view_making_the_modification);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.valuesReplacedByReverse = function (context)
{
    //TODO : add sanity checks
    this.x = context.saved_x;
    this.y = context.saved_y;
    this.resetBounds (view_making_the_modification);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.valuesReplacedBy = function (view_making_the_modification,
                                               new_x_array,
                                               new_y_array)
{
    //TODO : add sanity checks
    var context = {};
    var values_replaced_by = new Action (Table2D.prototype.valuesReplacedByDirect,
                                         Table2D.prototype.valuesReplacedByReverse);

    context.target = this;
    context.saved_x = this.getCloneOfX ();
    context.saved_y = this.getCloneOfY ();
    values_replaced_by.execute (context,
                                view_making_the_modification,
                                new_x_array,
                                new_y_array);
}

/*---------------------------------------------------------------------------*/
/* single value change */

/*---------------------------------------------------------------------------*/
Table2D.prototype.singleValueChangedByDirect = function (view_making_the_modification,
                                                         value_index,
                                                         new_x,
                                                         new_y)
{
    this.altered = true;
    this.x[value_index] = new_x;
    this.y[value_index] = new_y;
    this.resetBounds (view_making_the_modification);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.singleValueChangedByReverse = function (context)
{
    this.altered = true;
    this.x[context.index] = context.saved_x;
    this.y[context.index] = context.saved_y;
    this.resetBounds (view_making_the_modification);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.singleValueChangedBy = function (view_making_the_modification,
                                                   value_index,
                                                   new_x,
                                                   new_y)
{
    var context = {};
    var single_value_changed_by = new Action (Table2D.prototype.singleValueChangedByDirect,
                                              Table2D.prototype.singleValueChangedByReverse);

    context.target = this;
    context.index = value_index;
    context.saved_x = this.x[value_index];
    context.saved_y = this.y[value_index];

    single_value_changed_by.execute (context,
                                     view_making_the_modification,
                                     value_index,
                                     new_x,
                                     new_y);
}

/*---------------------------------------------------------------------------*/
/* Insertion */

Table2D.prototype.insertAfter = function (index, new_x, new_y)
{

    if (index == this.x.length-1) // Note we should never be there from graphic editing
    {
        this.x.push (new_x);
        this.y.push (new_y);
    }
    else
    {
        this.x.splice(index+1, 0, new_x);
        this.y.splice(index+1, 0, new_y);
    }
    this.resetBounds(this);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.insertNewPointAfterDirect = function (index)
{
    var new_x = 0;
    var new_y = 0;

    if (index == this.x.length-1) // Note we should never be there from graphic editing
    {
        new_x = this.x[this.x.length-1];
        new_y = this.y[this.y.length-1];
    }
    else
    {
        new_x = (this.x[index] + this.x[index+1])/2.0;
        new_y = (this.y[index] + this.y[index+1])/2.0;
    }
    this.insertAfter (index, new_x, new_y);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.insertNewPointAfterReverse = function (context)
{
    this.x.splice (context.index +1, 1);
    this.y.splice (context.index +1, 1);
    this.resetBounds (this);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.insertNewPointAfter = function (index)
{
    var context = {};
    var insert_new_point_after = new Action (Table2D.prototype.insertNewPointAfterDirect,
                                             Table2D.prototype.insertNewPointAfterReverse);
    context.target = this;
    context.index = index;
    insert_new_point_after.execute(context, index);
}

/*---------------------------------------------------------------------------*/
/* Removal */
Table2D.prototype.removeAtIndexDirect = function (index)
{
    this.x.splice(index, 1);
    this.y.splice(index, 1);

    this.resetBounds (this);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.removeAtIndexReverse = function (context)
{
    this.insertAfter (context.index-1, context.saved_x, context.saved_y);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.removeAtIndex = function (index)
{
    var context = {};
    var remove_at_index = new Action  (Table2D.prototype.removeAtIndexDirect,
                                       Table2D.prototype.removeAtIndexReverse);
    context.target = this;
    context.index = index;
    context.saved_x = this.x[index];
    context.saved_y = this.y[index];
    remove_at_index.execute(context, index);
}
