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

Object.defineProperty (SVGElement.prototype,
                        "offsetParent",
                        {
                          get ()
                          {
                              return $(this).closest ("div").get(0);
                          }
                        });

Object.defineProperty (SVGElement.prototype,
                        "offsetWidth",
                        {
                          get ()
                          {
                              var rectangle = this.getBoundingClientRect();
                              return Math.round (rectangle.width);
                          }
                        });

Object.defineProperty (SVGElement.prototype,
                          "offsetHeight",
                          {
                            get ()
                            {
                                var rectangle = this.getBoundingClientRect();
                                return Math.round (rectangle.height);
                            }
                          });

                        /*
SVGElement.prototype.getBoundingClientRect = function ()
{
  var bounding_box = this.getBBox();
  return {
          x : bounding_box.x,
          y : bounding_box.y,
          width : bounding_box.w,
          height: bounding_box.h,
          top : bounding_box.y,
          right : bounding_box.x + bounding_box.w,
          bottom: bounding_box.y + bounding_box.h,
          left : bounding_box.x
        };
};
*/