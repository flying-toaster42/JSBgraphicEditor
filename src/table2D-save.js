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

/*---------------------------------------------------------------------------*/
Table2D.prototype.storeBackInXML = function ()
{
    this.XML_source.empty();

    var new_contents ="\n";
    var x = 0;
    var y = 0;

    for (index in this.x)
    {
        x = parseFloat(this.x[index])/this.x_axis.unit.factor;
        y = parseFloat(this.y[index])/this.y_axis.unit.factor;

        new_contents += "\t\t"+x+"\t"+y+"\n";
    }

    this.XML_source.text (new_contents);
}