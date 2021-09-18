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
/* 3D tables */

function Table3D ()
{
    this.name = "";
    this.XML_source = null;
    this.y_axis_name = "";
    this.x_axis_name = "";
    this.y_values = [];
    this.tables = [];
}

/*---------------------------------------------------------------------------*/
function fillTable3D (xml_input, created_table)
{
    created_table.XML_source = $(xml_input).find ("tableData").first();

    var text_data = created_table.XML_source.text();
    var lines = text_data.split ('\n');
    var new_x = 0;
    var new_z = 0;
    var line = "";
    var values = [];
    var x_min = Infinity;
    var x_max = -Infinity;

    // First seek the first non empty line
    var found_first_line = false;
    var line_index = 0;
    var y_labels = [];

    while (!found_first_line && line_index < lines.length)
    {
        var line = lines [line_index];
        line = line.trim();
        if (line != '')
         {
            y_labels = line.split (/\s+/);
             found_first_line = true;
         }
         line_index++;
    }

    for (y_text of y_labels)
    {
        created_table.y_values.push (parseFloat (y_text));
        var subtable = new Table2D();
        subtable.name = created_table.y_axis_name+ " = " + y_text;
        subtable.parent_name = created_table.name;
        subtable.y_axis.name = created_table.name;
        subtable.x_axis.name = created_table.x_axis_name;
        created_table.tables.push (subtable);
    }

    while (line_index < lines.length)
    {
        var line = lines [line_index];
        line = line.trim();
        if (line != '')
        {
            values = line.split (/\s+/);

            new_x = parseFloat (values [0]);
            if (x_min > new_x) x_min = new_x;
            if (x_max < new_x) x_max = new_x;

            for (table of created_table.tables)
            {
                table.x.push(new_x);
            }

            for (var index = 0; index < created_table.tables.length; index ++)
            {
             new_z = parseFloat (values [index+1]);
             created_table.tables [index].y.push (new_z);

             if (created_table.tables [index].y_axis.min > new_z)
                        created_table.tables [index].y_axis.min = new_z;
             if (created_table.tables [index].y_axis.max < new_z)
                        created_table.tables [index].y_axis.max = new_z;
            }
        }

        line_index++;
    }

    for (table of created_table.tables)
    {
        table.x_axis.min = x_min;
        table.x_axis.max= x_max;
    }
}