/*---------------------------------------------------------------------------*/
var central_pane =
{
    divs : [],

/*---------------------------------------------------------------------------*/
    resize: function ()
    {
        if (this.divs.length > 0)
        {
            var header_height = $("#header").outerHeight();
            var height = window.innerHeight
                        - header_height
                        - $("#footer").outerHeight()
                        - 6;
            for (div of this.divs) div.style.height = height+"px";
            $("#tree")[0].style.height = ((height+6)*0.25)-$("#file-name").outerHeight()+"px";
            $("#tables-list")[0].style.height = ((height+6)*0.75)-$("#table-title").outerHeight()+"px";
        }
    }
}