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

// remaps all the tables in a 3D table so that they share the same absissas 
// Note This is not undoable
Table3D.prototype.remapX = function ()
{
    var x_set = new Set();
    var new_x_array = [];
    var table = null;
    var value = 0;

    // Create a set with all the values of x
    for (table of this.tables)
    {
        for (value of table.x)
        {
            x_set.add (value);
        }
    }

    //tranform the set in an ordered array
    new_x_array = [...x_set];
    new_x_array.sort();

    //interpolate values that are not present in all tables
    for (table of this.tables)
    {
        for (value of new_x_array)
        {
            if (! table.x.includes(value) )
            {
                table.insertInterpolation (value);
            }
        }
        table.resetBounds(table);
    }

}

/*---------------------------------------------------------------------------*/
Table3D.prototype.storeBackInXML = function ()
{
    this.XML_source.empty();

    var new_contents ="";
    var x = 0;
    var y = 0;

    //write first line with y values
    new_contents += "\n\t\t";
    for (index in this.y_values)
    {
        y = parseFloat(this.y_values[index]);

        new_contents += "\t"+y;
    }
    new_contents += "\n";

    this.remapX();

    //2D tables
    for (line_index in this.tables[0].x)
    {
        //TODO : check that we go back to the original data
        x = parseFloat(this.tables[0].x[line_index])/this.tables[0].x_axis.unit.factor;

        new_contents += "\t"+x;

        for (column_index in this.tables)
        {
            y = parseFloat(this.tables[column_index].y[line_index])
                /this.tables[column_index].y_axis.unit.factor;

            new_contents += "\t"+y;
        }

         new_contents +="\n";
    }

    this.XML_source.text (new_contents);
}