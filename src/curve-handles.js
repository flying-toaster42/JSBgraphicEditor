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
function placeHandle (handle)
{
    var translation_x = handle.drag_translation.x
                        + handle.start_drag_translation.x
                        + handle.hover_translation.x;

    var translation_y = handle.drag_translation.y
                        + handle.start_drag_translation.y
                        + handle.hover_translation.y;

    handle.transform("translate("+ translation_x +
                     ", "+ translation_y +") "+
                     "scale("+ handle.scale +","+ handle.scale +") ");
}

/*---------------------------------------------------------------------------*/
function cleanTempLines (curve)
{
    for (line of curve.temp_lines) line.remove();
        curve.temp_lines = [];
}

/*---------------------------------------------------------------------------*/
function drawTempLine (curve, index, center_x, center_y)
{
    var handles = curve.handles;
    var temp_line_style = {stroke: "#00FF00",strokeWidth: 1, fill:"none", 'stroke-dasharray':'2 2 6 2'};
    cleanTempLines (curve);

    if (index == 0)
    curve.temp_lines.push(curve.drawing.line (center_x,
                                              center_y,
                                              handles[index+1].center_x,
                                              handles[index+1].center_y)
                                       .attr(temp_line_style));
    else if (index == curve.handles.length -1)
    curve.temp_lines.push(curve.drawing.line (handles[index-1].center_x,
                                              handles[index-1].center_y,
                                              center_x,
                                              center_y)
                                        .attr(temp_line_style));
    else
    {
        curve.temp_lines.push(curve.drawing.line (handles[index-1].center_x,
                                                  handles[index-1].center_y,
                                                  center_x,
                                                  center_y)
                                           .attr(temp_line_style));
        curve.temp_lines.push(curve.drawing.line (center_x,
                                                  center_y,
                                                  handles[index+1].center_x,
                                                  handles[index+1].center_y)
                                            .attr(temp_line_style));
    }
}


/*---------------------------------------------------------------------------*/
function dragHandle (curve,handle, dx,dy)
{
    var handles = curve.handles;

    if (curve.constrained) var center_x = handle.center_x;
    else var center_x = handle.center_x + dx;

    var index = parseInt(handle.point_index);
    // limit motion in X to remain a function
    if (index == 0)
    {
        if (center_x > handles[index+1].center_x)
        {
            center_x = handles[index+1].center_x;
        }
    }
    else if (index == handles.length - 1)
    {
        if (center_x < handles[index-1].center_x)
                center_x = handles[index-1].center_x;
    }
    else
    {
        if (center_x > handles[index+1].center_x)
                center_x = handles[index+1].center_x;
        if (center_x < handles[index-1].center_x)
                center_x = handles[index-1].center_x;
    }

    handle.drag_translation.x = center_x - handle.center_x;

    handle.drag_translation.y = -dy;

    var start_drag_translation_x = handle.start_drag_translation.x
                                   + handle.drag_translation.x;

    var start_drag_translation_y = handle.start_drag_translation.y
                                   + handle.drag_translation.y;

    var center_y = handle.center_y - dy;

    var new_x = (start_drag_translation_x + handle.center_x -margin)
                / curve.x_factor + curve.view_x_min;

    var new_y = ( start_drag_translation_y + handle.center_y - margin)
                / curve.y_factor + curve.view_y_min;

    placeHandle (handle);

    drawTempLine (curve, index, center_x, center_y);

    curve.table2D.singleValueChangedBy (curve, handle.point_index,
                                        new_x, new_y);
}

/*---------------------------------------------------------------------------*/
function startDragHandle (curve, handle, event)
{
    var index = parseInt(handle.point_index);
    var center_x = handle.center_x;
    var center_y = handle.center_y;

    drawTempLine (curve, index, center_x, center_y);

    curve.table2D.valuesEditedBy(handle, handle.point_index);
}

/*---------------------------------------------------------------------------*/
function endDragHandle (curve, handle)
{
    handle.start_drag_translation.x += handle.drag_translation.x;
    handle.start_drag_translation.y += handle.drag_translation.y;

    var new_x = (handle.start_drag_translation.x + handle.center_x -margin)
                / curve.x_factor + curve.view_x_min;

    var new_y = ( handle.start_drag_translation.y + handle.center_y - margin)
                / curve.y_factor + curve.view_y_min;

    curve.table2D.singleValueChangedBy (curve, handle.point_index, new_x, new_y);
    
    curve.reDraw();
}

/*---------------------------------------------------------------------------*/
const hover_magnification = 1.5;

function handleHoverIn (handle)
{
    handle.hover_translation = {x : (1-hover_magnification) * handle.center_x,
                                y : (1-hover_magnification) * handle.center_y};
    handle.scale = hover_magnification;
    placeHandle (handle);

    handle.attr({stroke:"#FF00FF"});
    setHelpLine ("Drag to change point; Shift + click to remove point; Handle number : "+handle.point_index);
}

/*---------------------------------------------------------------------------*/
function handleHoverOut (handle, curve)
{
    handle.hover_translation = {x : 0, y : 0};
    handle.scale = 1.0;
    placeHandle (handle);
    handle.attr({stroke:"#00FFFF"});
    curve.setDefaultHelp();
}

/*---------------------------------------------------------------------------*/
Curve.prototype.drawHandles = function ()
{
    if (this.table2D == null) return;

    var me = this;
    this.handles = [];

    for (let i in this.table2D.x)
    {
        /*
        this.drawing.add(this.drawing.use (this.handle_symbol)
                    .attr({x:(this.table2D.x[i]-this.view_x_min)*this.x_factor+margin,
                           y:(this.table2D.y[i]-this.view_y_min)*this.y_factor+margin }));*/

        // TODO : fix symbols (viewbox)

        let x = (this.table2D.x[i]-this.view_x_min)*this.x_factor+margin;
        let y = (this.table2D.y[i]-this.view_y_min)*this.y_factor+margin;
        let handle = this.drawing.circle (x, y, 3.0).attr (circle_style);

        //add information to the handle
        handle.drag_translation = {x : 0, y : 0};
        handle.start_drag_translation = {x : 0, y : 0};
        handle.center_x = x;
        handle.center_y = y;
        handle.point_index = parseInt(i);

        handle.drag((dx,dy,x,y,event)=>{
                                            event.stopPropagation();
                                            dragHandle(me, handle, dx, dy);
                                        },
                    (x,y, event)=>{event.stopPropagation();
                                    if (event.shiftKey)
                                    {
                                        me.table2D.removeAtIndex (handle.point_index);
                                        handle.undrag();
                                        return;
                                    }
                                    else startDragHandle(me, handle, event)
                                    },
                    (event)=>{event.stopPropagation();
                              endDragHandle(me, handle)});

        handle.hover (()=>{me.table2D.highlightOtherViews(me, handle.point_index);
                           handleHoverIn (handle);},
                      ()=>{me.table2D.stopOthersHighlight(me, handle.point_index);
                           handleHoverOut(handle, me)});

        this.handles.push (handle);
    }
}

/*---------------------------------------------------------------------------*/
Curve.prototype.reactToEdition = function (index_of_edited_value)
{
    this.handles[index_of_edited_value].attr ({fill:"red", stroke:"red"});
}

/*---------------------------------------------------------------------------*/
Curve.prototype.stopEditing = function ()
{
    this.handles[this.table2D.index_edited].attr ({fill:"black", stroke:"#00FFFF"});
}

/*---------------------------------------------------------------------------*/
Curve.prototype.reactToUpdatedValue = function (index)
{
 ;
}

/*---------------------------------------------------------------------------*/
Curve.prototype.reactToExternalHighlight = function (index)
{
    handleHoverIn (this.handles[index]);
}

/*---------------------------------------------------------------------------*/
Curve.prototype.stopExternalHighlight = function (index)
{
  handleHoverOut (this.handles[index], this);
}