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


const one_second_in_ms = 1000.0;

/*###########################################################################*/
// Globals

var application_window =
{

};
var central_panel = {};
var header = {};
var footer = {};
var main_window_top_level_SVG = {};
var tree_window_top_level_SVG = {};
var main_window_SVG_canvas = {};
var tree_window_SVG_canvas = {};
var curve1 = null;
var numeric_view = null;
var graph_view = null;

/*###########################################################################*/
// window handlers


/* init ********************************************************************* */
window.onload = function ()
{
    /*
    main_window_SVG_canvas = Snap ("#SVG-canvas");
    main_window_SVG_canvas.attr({viewBox: [0, 0, 320, 200]});
    main_window_top_level_SVG = main_window_SVG_canvas.g();
    tree_window_SVG_canvas = Snap ("#SVG-canvas");
    tree_window_SVG_canvas.attr({viewBox: [0, 0, 320, 200]});
    tree_window_top_level_SVG = tree_window_SVG_canvas.g();
    */
    central_panel = document.getElementById("center-panel");
    central_pane.divs.push(document.getElementById("central-pane"));
    central_pane.divs.push(document.getElementById("graphic-area"));
    central_pane.divs.push(document.getElementById("right-pane"));
    header = document.getElementById("header");
    footer = document.getElementById("footer");
    const resize_observer = new ResizeObserver(()=>{central_pane.resize ();
        if (curve1 != null) curve1.resize();
        if (graph_view != null) graph_view.resize();});
    resize_observer.observe (document.getElementById("tables"));

    initHelpLine();
    initUnits ();
    $("#central-pane").hide();
    setHelpLine("No file loaded");

    $(window).keydown (function (event)
                        {
                            if (event.ctrlKey && event.key == 'z') undoAction();
                            if (event.ctrlKey && event.key == 'o') loadJSB();
                            if (event.ctrlKey && event.key == 's') saveJSB();
                            if (curve_active != null
                                && event.ctrlKey
                                && event.key == 'c') curve_active.table2D.copy();

                            if (curve_active != null
                                && event.ctrlKey
                                && event.key == 'v') curve_active.table2D.paste();
                        });

    //graph_view = new GraphView ("#curve", "#curve-title", "#buttons");

  /*  loadJSB ("F-20p.xml");
    central_pane.resize ();*/

}


/* resizing ***************************************************************** */
const resize_timeout = 0.2 * one_second_in_ms;
var resize_timer = resize_timeout;
var resizing = false;
const resize_timer_tick = 0.1 * one_second_in_ms;

function resizingTimer ()
{
    resize_timer -= resize_timer_tick;
    if (resize_timer < 0.0)
    {
        resizing = false;
        resize_timer = resize_timeout;
        central_pane.resize ();
        if (curve1 != null) curve1.resize();
        if (graph_view != null) graph_view.resize();
    }
    else setTimeout(resizingTimer, resize_timer_tick);

}

/* resizing handler ********************************************************* */
window.onresize = function ()
{
    resize_timer = resize_timeout;
    if (!resizing)
    {
     setTimeout (resizingTimer, resize_timer_tick);
     resizing = true;
    }
}

window.onmessage = (event) => {
    // event.source === window means the message is coming from the preload
    // script, as opposed to from an <iframe> or other source.
    if (event.source === window && event.data === 'save before closing')
    {
        saveJSB ()
        window.API.exit ();
    }
}
