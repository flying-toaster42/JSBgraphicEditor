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

/* ----------------------------------------------------------------------- */
function Box ()
{
    this.anchors = [];
}

/* ----------------------------------------------------------------------- */
Box.prototype.addAnchor (face, location, type)
{
    this.anchors.push (new Anchor (this, face, location, type));
}

/* ----------------------------------------------------------------------- */
Box.prototype.move = function()
{
    for (anchor of this.anchors) anchor.move();
}