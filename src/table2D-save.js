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
    //Search for adequate tabulation level
    var parent_text = this.XML_source[0].parentElement.outerHTML;
    var tag_index = parent_text.search ("<tableData>");
    var start_index = tag_index;

    while (start_index != 0 && parent_text[start_index]!='\n')
    {
        start_index --;
    }
    start_index++;

    var root_tabulation = "";
    for (var i = start_index; i<tag_index;i++)
    {
        root_tabulation+= parent_text[i];
    }

    //fill the text
    this.XML_source.empty();

    var new_contents ="\n";
    var x = 0;
    var y = 0;

    for (index in this.x)
    {
        x = parseFloat(this.x[index])/this.x_axis.unit.factor;
        y = parseFloat(this.y[index])/this.y_axis.unit.factor;

        new_contents += root_tabulation+"\t"+x+"\t"+y+"\n";
    }
    new_contents += root_tabulation;

    this.XML_source.text (new_contents);
}