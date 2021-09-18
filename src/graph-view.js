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


function GraphView (svg_root, title_bar, buttons)
{
    this.container = $(svg_root).parent();
    this.decorated_window = this.container.parent();
    this.title_bar = $(title_bar);
    this.buttons = $(buttons);
    this.width = 400;
    this.height = 300;
    this.view_x_min = -1;
    this.view_x_max = 1;
    this.view_y_min = -1;
    this.view_y_max = 1;
    this.scale = 1.0;

    this.hidden = false;


    this.resize();

}

/*---------------------------------------------------------------------------*/
GraphView.prototype.computeFactors = function ()
{
    this.x_factor = (this.width - 2*margin)
                    /
                    (this.view_x_max - this.view_x_min);
    this.y_factor = (this.height- 2*margin)
                    /
                    (this.view_y_max - this.view_y_min);
}

/*---------------------------------------------------------------------------*/
GraphView.prototype.resize = function ()
{
    if (this.hidden) return;

    this.width = $(this.decorated_window).width();
    if (this.width < 1.0) this.width =1.0;
    this.height = $(this.decorated_window).height()-this.buttons.outerHeight()-this.title_bar.outerHeight();
    if (this.height < 1.0) this.height =1.0;
    this.container.css({top:this.title_bar.outerHeight(), height:this.height});
    this.reDraw();
}

/*---------------------------------------------------------------------------*/
GraphView.prototype.reDraw = function ()
{
    this.container.empty();

    this.container.append ('<div id="rect1" class="floating-box"></div>');
    $("#rect1").css({top: "50px", left: "50px"});

    this.container.append ('<div id="rect2" class="floating-box"></div>');
    $("#rect2").css({top: "200px", left: "300px"});

    this.instance.connect({
        source:"rect1",
        target:"rect2"/*,
    connector:jsPlumb.Connectors.Flowchart.type*/});

}
