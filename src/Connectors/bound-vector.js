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
function Vector (x, y)
{
    this.x_length = x;
    this.y_length = y;
}

/* ----------------------------------------------------------------------- */
Vector.prototype.dotProduct = function (vector_2)
{
    return this.x_length * vector_2.x_length
           +
           this.y_length * vector_2.y_length;
}

/* ----------------------------------------------------------------------- */
function Point (x,y)
{
    this.x = x;
    this.y = y;
}

/* ----------------------------------------------------------------------- */
function BoundVector (origin, destination)
{
    Vector.call (this,
                     destination.x - origin.x,
                     destination.y - origin.y);

    this.origin_x = origin.x;
    this.origin_y = origin.y;
}

BoundVector.prototype = Object.create(Vector.prototype);

/* ----------------------------------------------------------------------- */
BoundVector.prototype.isInFront (point)
{
    return this.dotProduct (new Vector (this.origin_x - point.x,
                                        this.origin_y - point.y)) > 0;
}