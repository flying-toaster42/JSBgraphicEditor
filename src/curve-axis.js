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

const axis_style = {stroke: "#FFFFFF",strokeWidth: 2};

const x_axis_stuck_up = 0;
const x_axis_stuck_down = 1;
const x_axis_regular = 2;

const y_axis_stuck_left = 0;
const y_axis_stuck_right = 1;
const y_axis_regular = 2;

/*---------------------------------------------------------------------------*/
Curve.prototype.drawXaxis = function ()
{
    if (this.view_y_min >=0) this.x_axis_position = margin;
    else if (this.view_y_max <=0) this.x_axis_position = this.height - margin;
    else this.x_axis_position = -this.view_y_min*this.y_factor+margin;

    this.drawing.line (0,
                       this.x_axis_position,
                       this.width,
                       this.x_axis_position).attr(axis_style);
}

/*---------------------------------------------------------------------------*/
Curve.prototype.drawYaxis = function ()
{

    if (this.view_x_min >=0) this.y_axis_position = margin;
    else if (this.view_x_max <=0) this.y_axis_position = this.width - margin;
    else this.y_axis_position = -this.view_x_min*this.x_factor+margin;

    this.drawing.line (this.y_axis_position,
                       0,
                       this.y_axis_position,
                       this.height)
                .attr (axis_style);
}

/*---------------------------------------------------------------------------*/
Curve.prototype.drawAxes = function ()
{

    this.drawXaxis();
    this.drawYaxis();

    //draw x ticks and labels
    var x_tick_factor = Math.log10 ((this.view_x_max-this.view_x_min)/5.0)-1;
    var x_increment = 5.0 * Math.pow (10.0, x_tick_factor);
    var first_tick = x_increment * Math.fround (this.view_x_min/x_increment);

    if (this.x_axis_position > (this.height - 14 ))
        var x_label_y = -(this.x_axis_position-19);
    else
        var x_label_y = -(this.x_axis_position+5);

    for (var i = 0; i<10; i++)
    {
        var tick_value = first_tick+i*x_increment;
        var tick_position = (tick_value-this.view_x_min) * this.x_factor + margin;
        this.drawing.line (tick_position,
                           this.x_axis_position-5,
                           tick_position,
                           this.x_axis_position+5).attr(axis_style);

        this.drawing.text (tick_position,
                           x_label_y,
                           tick_value.toFixed (Math.abs (Math.round(x_tick_factor))))
                           .attr ({'font-size' : '12px', fill : 'white'})
                           .transform ("scale(1,-1)");
    }
    if (this.x_axis_position > (this.height - 14 ))
        var x_label_y = -(this.x_axis_position-31);
    else
        var x_label_y = -(this.x_axis_position+17);

    this.drawing.text (this.width,
                       x_label_y,
                       this.table2D.x_axis.name)
        .attr ({'font-size' : '12px', fill : 'cyan', 'text-anchor':"end"})
        .transform ("scale(1,-1)");

    //draw y ticks and labels
    var y_tick_factor = Math.log10 ((this.view_y_max-this.view_y_min)/5.0)-1.0;
    var y_increment = 5.0 * Math.pow (10.0, y_tick_factor);
    var first_tick = y_increment * Math.fround (this.view_y_min/y_increment);

    for (var i = 0; i<10; i++)
    {
        var tick_value = first_tick+i*y_increment;
        var tick_position = (tick_value-this.view_y_min) * this.y_factor + margin;
        this.drawing.line (this.y_axis_position-5,
                           tick_position,
                           this.y_axis_position+5,
                           tick_position).attr(axis_style);

        if (this.y_axis_position > (this.width - 64 ))
        {
            var y_label_x = this.y_axis_position-10;
            var anchor = "end";
        }
        else
        {
            var y_label_x = this.y_axis_position+5;
            var anchor = "start";
        }

        this.drawing.text (y_label_x,
                            -tick_position,
                            tick_value.toFixed (Math.abs (Math.round(y_tick_factor))))
                            .attr ({'font-size' : '12px', fill : 'white', 'text-anchor' : anchor})
                            .transform ("scale(1,-1)");
    }
}
