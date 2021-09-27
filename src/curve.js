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

const margin = 5.0;
const circle_style = {stroke: "#00FFFF",strokeWidth: 1.5, fill:"#000000"};

function Curve (svg_root, title_bar, buttons)
{
    this.container = $(svg_root).parent();
    this.decorated_window = this.container.parent();
    this.svg = Snap(svg_root);
    this.title_bar = $(title_bar);
    this.buttons = $(buttons);
    this.drawing = this.svg.group();
    this.width = 400;
    this.height = 300;
    this.table2D = null;
    this.view_x_min = -1;
    this.view_x_max = 1;
    this.view_y_min = -1;
    this.view_y_max = 1;
    this.scale = 1.0;
    this.last_cursor = {x:0, y:0};
    this.zoom_center = {x:0, y:0};
    this.drag_center = {x:0, y:0};
    this.highlighted_index = -1;
    this.temp_lines = [];
    this.hidden = true;

    var me = this;

  //  this.container.mouseenter (function (event) {active_curve = me;});

  //  this.container.mouseleave (function (event) {active_curve = null;});

    this.container.on ("wheel", function (event)
                                {
                                    event.preventDefault();
                                    var factor = Math.pow (2.0,event.originalEvent.deltaY * -0.01);
                                    me.scale *= factor;
                                    if (me.scale < 0.125 || me.scale > 16 ) factor = 1;

                                    var center_x = event.pageX - me.container.offset().left;
                                    var center_y = event.pageY - me.container.offset().top
                                    if (!(Math.abs (me.last_cursor.x - center_x) < 10
                                          &&
                                          Math.abs (me.last_cursor.y - center_y) < 10))
                                    {
                                        me.zoom_center.x = (center_x-margin) / me.x_factor + me.view_x_min;
                                        me.zoom_center.y = (me.height - center_y-margin) / me.y_factor + me.view_y_min;
                                    }

                                    me.zoom(me.zoom_center.x,
                                            me.zoom_center.y,
                                            factor);
                                    me.last_cursor.x = center_x;
                                    me.last_cursor.y = center_y;
                                });

    this.container.on ("mousedown", function (event)
                                {
                                    event.preventDefault();
                                    if (event.button == 1) me.resetZoom();
                                });

    this.setDefaultDrag();
    this.getButtons();

    this.resize();
    this.setDefaultHelp();

}

/*---------------------------------------------------------------------------*/
Curve.prototype.computeFactors = function ()
{
    this.x_factor = (this.width - 2*margin)
                    /
                    (this.view_x_max - this.view_x_min);
    this.y_factor = (this.height- 2*margin)
                    /
                    (this.view_y_max - this.view_y_min);
}

/*---------------------------------------------------------------------------*/
Curve.prototype.resize = function ()
{
    if (this.hidden) return;

    this.width = $(this.decorated_window).width();
    this.height = $(this.decorated_window).height()-this.buttons.outerHeight()-this.title_bar.outerHeight();
    var viewbox = {viewBox:0+" "+0+" "+ this.width+" "+
                                        this.height};
    //this.drawing.attr(viewbox);
    this.svg.attr(viewbox);

    this.computeFactors();
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.connectTable = function (table2D)
{

    if (this.table != null && this.table != table2d) this.table.releaseViews();

    if (this.hidden)
    {
        $("#graphic-placeholder").hide(0);
        $("#graphic-area").show(0);
        this.hidden = false;
    }
    this.table2D = table2D;
    this.resetZoom ();
    this.resize();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.hide = function ()
{
    $("#graphic-placeholder").show(0);
    $("#graphic-area").hide(0);
    this.hidden = true;
}

/*---------------------------------------------------------------------------*/
Curve.prototype.reactToUpdatedTable = function ()
{
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.reactToUnitsChange = function ()
{
    this.view_x_max *= this.table2D.x_axis.unit.factor
                       * this.table2D.x_axis.unit.revert_factor;
    this.view_x_min *= this.table2D.x_axis.unit.factor
                       * this.table2D.x_axis.unit.revert_factor;
    this.view_y_max *= this.table2D.y_axis.unit.factor
                       * this.table2D.y_axis.unit.revert_factor;
    this.view_y_min *= this.table2D.y_axis.unit.factor
                       * this.table2D.y_axis.unit.revert_factor;

    this.x_span =  this.view_x_max - this.view_x_min;
    this.y_span =  this.view_y_max - this.view_y_min;

    this.computeFactors();
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.resetZoom = function ()
{
    if (this.table2D.y_axis.max != this.table2D.y_axis.min)
    {
        this.view_y_min= this.table2D.y_axis.min;
        this.view_y_max= this.table2D.y_axis.max;
    }
    else
    {
        if (this.table2D.y_axis.max > 0)
        {
            this.view_y_min= 0;
            this.view_y_max= 2 * this.table2D.y_axis.max;
        }
        else if (this.table2D.y_axis.max < 0)
        {
            this.view_y_max = 0;
            this.view_y_min = 2 * this.table2D.y_axis.max;
        }
        else
        {
            this.view_y_max = 1;
            this.view_y_min = -1;
        }

    }
    this.view_x_min= this.table2D.x_axis.min;
    this.view_x_max= this.table2D.x_axis.max;
    this.x_span =  this.view_x_max - this.view_x_min;
    this.y_span =  this.view_y_max - this.view_y_min;
    this.scale = 1.0;

    this.computeFactors();
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.zoom = function (center_x_curve_units, center_y_curve_units, factor)
{
    this.view_x_min = center_x_curve_units- this.x_span/(2*factor);
    this.view_y_min = center_y_curve_units- this.y_span/(2*factor);
    this.view_x_max = center_x_curve_units+ this.x_span/(2*factor);
    this.view_y_max = center_y_curve_units+ this.y_span/(2*factor);
    this.x_span =  this.view_x_max - this.view_x_min;
    this.y_span =  this.view_y_max - this.view_y_min;
    this.computeFactors();
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.zoomBox = function (x1, y1, x2, y2)
{
    if (x1==x2 || y1==y2) return;
    this.view_x_min = Math.min(x1,x2);
    this.view_x_max = Math.max(x1,x2);
    this.view_y_min = Math.min(y1,y2);
    this.view_y_max = Math.max(y1,y2);
    this.x_span =  this.view_x_max - this.view_x_min;
    this.y_span =  this.view_y_max - this.view_y_min;
    this.computeFactors();
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.changeCenter = function (x, y)
{
    this.view_x_min = x - this.x_span/2;
    this.view_x_max = x + this.x_span/2;
    this.view_y_min = y - this.y_span/2;
    this.view_y_max = y + this.y_span/2;
    this.computeFactors();
    this.reDraw();
}


/*---------------------------------------------------------------------------*/
Curve.prototype.drawCurve = function ()
{
    if (this.table2D == null) return;
    var curve_style = {stroke: "#00FFFF",strokeWidth: 1, fill:"none"};
    var poly = [];

    for (var i in this.table2D.x)
    {
        poly.push ((this.table2D.x[i]-this.view_x_min)*this.x_factor+margin);
        poly.push ((this.table2D.y[i]-this.view_y_min)*this.y_factor+margin);
    }
    this.drawing.polyline (poly).attr (curve_style);

}

/*---------------------------------------------------------------------------*/
var segments = [];
Curve.prototype.drawSegmentHandles = function ()
{
    if (this.table2D == null) return;
    var segment_style = {stroke: "#353535",strokeWidth: 5, fill:"none",'stroke-opacity' : 0.0};
    var me = this;
    segments=[];

    for (let i=0; i < this.table2D.x.length -1; i++)
    {
        segments.push (this.drawing.line ((this.table2D.x[i]-this.view_x_min)*this.x_factor+margin,
                                     (this.table2D.y[i]-this.view_y_min)*this.y_factor+margin,
                                     (this.table2D.x[i+1]-this.view_x_min)*this.x_factor+margin,
                                     (this.table2D.y[i+1]-this.view_y_min)*this.y_factor+margin)
                              .attr (segment_style));
        segments[i].hover (()=>{
                                segments[i].attr({'stroke-opacity' : 0.8});
                                setHelpLine("Click to add point");},
                           ()=>{
                                segments[i].attr({'stroke-opacity' : 0.0});
                                me.setDefaultHelp();});
        segments[i].mousedown((event)=>{
                                        event.stopPropagation();
                                        me.table2D.insertNewPointAfter (i);
                                       });
    }


}

/*---------------------------------------------------------------------------*/
const title_attributes = {'font-style':'italic', 'font-size':'13px', fill:'white' };
const title_shadow_attributes = {'font-style':'italic', 'font-size':'13px', fill:'black', opacity:'0.5' };
var blur = null;

Curve.prototype.drawTitle = function ()
{
    if (this.table2D == null) return; //not initialized yet
/*
    if (blur !=null) blur.remove();
    blur = this.svg.filter(Snap.filter.blur(2, 2));

    this.drawing.text(16,40-this.height,this.table2D.name)
                .attr(title_attributes)
                .transform ("scale(1,-1)");
    title_shadow_attributes.filter = blur;
    this.drawing.text(16,40-this.height,this.table2D.name)
                .attr(title_shadow_attributes)
                .transform ("scale(1,-1)");
*/
  this.title_bar.text (this.table2D.parent_name+" ("+this.table2D.name+")");
}

/*---------------------------------------------------------------------------*/
Curve.prototype.reDraw = function ()
{
    this.drawing.clear();
    this.svg.transform("scale(1,-1)");

    /*
    var circle = this.drawing.circle (0,0,3.0).attr (circle_style);
    this.handle_symbol = this.drawing.symbol();
    this.handle_symbol.add (circle);
    this.handle_symbol.toDefs();
    */

    this.drawAxes();
    this.drawCurve();
    this.drawSegmentHandles();
    this.drawHandles();
    this.setDefaultHelp();
    this.drawTitle();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.setDefaultHelp = function ()
{
    clearHelpLine();
    if (this.scale == 1.0)
        setHelpLine("Drag to pan; Mouse wheel to zoom");
    else
        setHelpLine("Drag to pan; Mouse wheel to zoom; Wheel click to reset zoom");
}