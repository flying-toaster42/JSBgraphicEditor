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

Curve.prototype.clearZoomBoxRectangle = function ()
{
    if (this.zoom_box_rectangle == null) return;
    this.zoom_box_rectangle.remove();
    this.zoom_box_rectangle = null;
}

/*---------------------------------------------------------------------------*/
const zoom_box_style = {stroke: "white",strokeWidth: 1, fill:"none", 'stroke-dasharray':'1 4'};

Curve.prototype.drawZoomBoxRectangle = function (x1,y1,x2,y2)
{
    var width = Math.abs (x1-x2);
    var height = Math.abs (y1-y2);
    var x = Math.min (x1,x2);
    var y = Math.min (y1,y2);
    this.clearZoomBoxRectangle();
    this.zoom_box_rectangle = this.drawing.rect(x,y,width,height)
                                          .attr(zoom_box_style);
}

/*---------------------------------------------------------------------------*/
Curve.prototype.setDefaultDrag = function ()
{
    var me = this;
    var dragging = true;
    this.svg.undrag();
    this.svg.drag((dx,dy,x,y)=>{if (dragging)
                                {
                                 me.dx = dx; me.dy = dy;
                                 me.drawing.transform ("translate("+dx+","+(-dy)+")")
                                }},
                      (x,y, event)=>{if (event.button == 1)
                                     {
                                        me.resetZoom();
                                        dragging = false;
                                        return;
                                     }
                                     else dragging = true;
                                     me.dx = 0;
                                     me.dy = 0;
                                     me.drag_center.x = me.view_x_min + me.x_span/2
                                     me.drag_center.y = me.view_y_min + me.y_span/2},
                      (event)=>{if (dragging)
                                {me.drawing.transform ("");
                                 me.changeCenter (me.drag_center.x - me.dx / me.x_factor,
                                                 me.drag_center.y + me.dy / me.y_factor);
                                 me.dx = 0;
                                 me.dy = 0;
                                }
                                dragging = true;});
}


/*---------------------------------------------------------------------------*/
Curve.prototype.setZoomBoxDrag = function (button)
{
    var me = this;
    var my_button = button;
    this.svg.undrag();
    this.svg.drag((dx,dy,x,y)=>{me.drawZoomBoxRectangle (me.drag_center.x,
                                                         me.drag_center.y,
                                                         me.drag_center.x + dx,
                                                         me.drag_center.y - dy)
                                me.dx = dx;
                                me.dy = dy;},
                      (x,y)=>{var position = me.container.offset();
                              var height = me.container.height();
                              me.drag_center.x = x - position.left;
                              me.drag_center.y = height - (y - position.top);
                              me.dx = 0;
                              me.dy = 0;},
                      (event)=>{me.clearZoomBoxRectangle();
                                my_button.removeAttribute("toggledOn");
                                me.box_zooming = false;
                                me.zoomBox ((me.drag_center.x - margin)
                                            / me.x_factor + this.view_x_min,
                                            (me.drag_center.y - margin)
                                            / me.y_factor + this.view_y_min,
                                            (me.drag_center.x + me.dx - margin)
                                            / me.x_factor + this.view_x_min,
                                            (me.drag_center.y - me.dy - margin)
                                            / me.y_factor + this.view_y_min);
                                me.setDefaultDrag();});
}


/*---------------------------------------------------------------------------*/
Curve.prototype.getButtons = function ()
{
    this.zoom_button = this.buttons.find ("#zoom");
    this.constraint_button = this.buttons.find ("#constraint");
    var me = this;
    this.box_zooming = false;
    this.constrained = false;

    this.zoom_button.click ((event)=>{
                                        if (me.box_zooming)
                                        {me.box_zooming = false;
                                         event.currentTarget.removeAttribute("toggledOn");
                                         me.setDefaultDrag();}
                                      else
                                        {me.box_zooming = true;
                                         event.currentTarget.setAttribute("toggledOn","true");
                                         me.setZoomBoxDrag(event.currentTarget);
                                        }
                                     });

    this.constraint_button.click ((event)=>{
                                            if (me.constrained)
                                            {
                                             me.constrained = false;
                                             event.currentTarget.removeAttribute("toggledOn");
                                            }
                                            else
                                            {
                                             me.constrained = true;
                                             event.currentTarget.setAttribute("toggledOn","true");
                                            }
                                           });
}