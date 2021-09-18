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

var tables = [];

/* ************************************************************************* */
/* Table factory */

/*---------------------------------------------------------------------------*/
function createTable(xml_input, number_in_parent)
{

    var independent_vars = $(xml_input).find("independentVar");

    if (independent_vars.length == 1)
    {
        var created_table = new Table2D ();
        created_table.name = $(xml_input).parents("function").attr("name")+" #"+number_in_parent;
        created_table.x_axis.name = $(independent_vars[0]).text();
        created_table.y_axis.name = $($(xml_input).find ("description")).text();
        created_table.fill (xml_input);
    }
    else
    {
        var created_table = new Table3D ();
        created_table.name = $(xml_input).parents("function").attr("name")+" #"+number_in_parent;
        for (var i = 0; i < 2; i++)
        {
            if ($(independent_vars[i]).attr("lookup")=="row")
                created_table.x_axis_name = $(independent_vars[i]).text();
            else
                created_table.y_axis_name = $(independent_vars[i]).text();
        }

        fillTable3D (xml_input, created_table);
    }

    tables.push (created_table);
    return created_table;

}
