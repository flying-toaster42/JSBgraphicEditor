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


var clipboard = null;

/*---------------------------------------------------------------------------*/
Table2D.prototype.copy = function ()
{
  this.storeBackInXML();
  clipboard = this.XML_source.text();
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.pasteDirect = function ()
{
    this.x = [];
    this.y = [];
    if (clipboard != null)
      this.XML_source.text (clipboard);
    this.fillFromText (clipboard);
    this.resetBounds (this);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.pasteReverse = function (context)
{
    this.x = [];
    this.y = [];

    this.XML_source.text (context.saved_contents);
    this.fillFromText (context.saved_contents);
    this.resetBounds (this);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.paste = function ()
{
    var paste_action = new Action (Table2D.prototype.pasteDirect,
                                   Table2D.prototype.pasteReverse);
    var context = {target : this};
    context.saved_contents = this.XML_source.text();

    paste_action.execute (context)
}