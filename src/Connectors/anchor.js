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

const anchor_is_up = 0;
const anchor_is_down = 1;
const anchor_is_left = 2;
const anchor_is_right = 3;

const start_anchor = 0;
const destination_anchor = 1;

/* -------------------------------------------------------------------------- */
function Anchor (rectangle, face, location, type)
{
    this.rectangle = rectangle;
    this.face = face;
    this.location = location;
    this.type = type;
}

/* -------------------------------------------------------------------------- */
Anchor.prototype.move = function ()
{

}