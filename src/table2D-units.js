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

let x_source_unit_combo = null;
let x_destination_unit_combo = null;
let y_source_unit_combo = null;
let y_destination_unit_combo = null;

const unit_data = {speed : {fps : 0.3048, mps : 1.0, kts : 1.852/3.6, kmh : 1/3.6},
                   angle : {deg : Math.PI/180, rad : 1.0},
                   distance : {ft : 0.3048, m : 1.0},
                   force : {N : 1, daN : 10 , Kgf : 9.81, lbf : 4.44822}};

var units = [];

const empty_source = "Src";
const empty_display = "No src";

/* -------------------------------------------------------------------------- */
function initUnits ()
{
    for (measure in unit_data) units = units.concat (Object.keys(unit_data[measure]));
    x_source_unit_combo = $("#x-source-unit");
    x_display_unit_combo = $("#x-display-unit");
    y_source_unit_combo = $("#y-source-unit");
    y_display_unit_combo = $("#y-display-unit");
}

/* -------------------------------------------------------------------------- */
function kindOfUnit (unit)
{
    var response = "none";
    for (kind_of_unit in unit_data)
        if (unit in unit_data[kind_of_unit]) response = kind_of_unit;

    return response;
}

/* -------------------------------------------------------------------------- */
function UnitManager ()
{
    this.source = empty_source;
    this.display = empty_display;
    this.factor = 1.0;
    this.revert_factor = 1.0;
}

const x_unit_changed = 0;
const y_unit_changed = 1;

/*---------------------------------------------------------------------------*/
Table2D.prototype.ySourceSelection = function ()
{
    this.y_axis.unit.source = y_source_unit_combo.find ("option:selected").attr("value");
    if (this.y_axis.unit.source == empty_source) return;

    y_source_unit_combo.find ("option[value='Src']").remove();
    this.y_axis.unit.display = y_display_unit_combo.find ("option:selected").attr("value");

    var new_display_list = Object.keys(unit_data[kindOfUnit(this.y_axis.unit.source)]);

    var kind_of_source = kindOfUnit (this.y_axis.unit.source);

    this.y_axis.unit.revert_factor = 1.0 / this.y_axis.unit.factor;

    if (kind_of_source != kindOfUnit (this.y_axis.unit.display))
    {
        y_display_unit_combo.empty();

        for (unit of new_display_list)
        {
            if (unit == this.y_axis.unit.source)
                y_display_unit_combo.append ('<option value="'+unit+'" selected="true">'+unit+'</option>');
            else
                y_display_unit_combo.append ('<option value="'+unit+'">'+unit+'</option>');
        }

        this.y_axis.unit.factor = 1.0;
    }
    else
    {
        this.y_axis.unit.factor = unit_data[kind_of_source][this.y_axis.unit.source]
                                 /unit_data[kind_of_source][this.y_axis.unit.display];
    }

    this.unitsChanged(y_unit_changed);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.yDisplaySelection = function ()
{
    this.y_axis.unit.source = y_source_unit_combo.find ("option:selected").attr("value");
    if (this.y_axis.unit.source == empty_source) return;

    this.y_axis.unit.display = y_display_unit_combo.find ("option:selected").attr("value");
    if (this.y_axis.unit.display == empty_display) return;

    var kind_of_source = kindOfUnit (this.y_axis.unit.source);

    this.y_axis.unit.revert_factor = 1.0 / this.y_axis.unit.factor;

    this.y_axis.unit.factor = unit_data[kind_of_source][this.y_axis.unit.source]
                             /unit_data[kind_of_source][this.y_axis.unit.display];

    this.unitsChanged(y_unit_changed);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.xSourceSelection = function ()
{
    this.x_axis.unit.source = x_source_unit_combo.find ("option:selected").attr("value");
    if (this.x_axis.unit.source == empty_source) return;
    x_source_unit_combo.find ("option[value='Src']").remove();
    this.x_axis.unit.display = x_display_unit_combo.find ("option:selected").attr("value");

    this.x_axis.unit.revert_factor = 1.0 / this.x_axis.unit.factor;

    var kind_of_source = kindOfUnit (this.x_axis.unit.source);

    var new_display_list = Object.keys(unit_data[kind_of_source]);

    if (x_source_unit_combo.find ("option:selected"))

    if (kind_of_source != kindOfUnit (this.x_axis.unit.display))
    {
        x_display_unit_combo.empty();
        for (unit of new_display_list)
        {
            if (unit == this.x_axis.unit.source)
                x_display_unit_combo.append ('<option value="'+unit+'" selected="true">'+unit+'</option>');
            else
                x_display_unit_combo.append ('<option value="'+unit+'">'+unit+'</option>');
        }
        this.x_axis.unit.factor = 1.0;
    }
    else
    {
        this.x_axis.unit.factor = unit_data[kind_of_source][this.x_axis.unit.source]
                                 /unit_data[kind_of_source][this.x_axis.unit.display];
    }

    this.unitsChanged(x_unit_changed);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.xDisplaySelection = function ()
{
    this.x_axis.unit.source = x_source_unit_combo.find ("option:selected").attr("value");
    if (this.x_axis.unit.source == empty_source) return;

    this.x_axis.unit.display = x_display_unit_combo.find ("option:selected").attr("value");
    if (this.x_axis.unit.display == empty_display) return;

    var kind_of_source = kindOfUnit (this.x_axis.unit.source);

    this.x_axis.unit.revert_factor = 1.0 / this.x_axis.unit.factor;

    this.x_axis.unit.factor = unit_data[kind_of_source][this.x_axis.unit.source]
                             /unit_data[kind_of_source][this.x_axis.unit.display];
    this.unitsChanged(x_unit_changed);
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.resetUnitSelection = function ()
{
    var me = this;

    y_source_unit_combo.empty();
    y_display_unit_combo.empty();
    x_source_unit_combo.empty();
    x_display_unit_combo.empty();

    if (this.x_axis.unit.source != empty_source)
    {
        for (unit of units)
        {
            if (unit == this.x_axis.unit.source) selection = ' selected="true" ';
            else selection = '';

            x_source_unit_combo.append ('<option value="'+unit+'" '+selection+'>'+unit+'</option>');
        }
        // Assumption : it is impossible for the display data not to be set if the source is set
        var kind_of_source = kindOfUnit(this.x_axis.unit.source);

        for (unit of Object.keys(unit_data[kind_of_source]))
        {
            if (unit == this.x_axis.unit.display) selection = ' selected="true" ';
            else selection = '';

            x_display_unit_combo.append ('<option value="'+unit+'" '+selection+'>'+unit+'</option>');
        }
    }
    else
    {
        x_source_unit_combo.append ('<option value="'+empty_source+'">'+empty_source+'</option>');
        for (unit of units)
            x_source_unit_combo.append ('<option value="'+unit+'">'+unit+'</option>');
        x_display_unit_combo.append ('<option value="'+empty_display+'">'+empty_display+'</option>');
    }

    if (this.y_axis.unit.source != empty_source)
    {
        for (unit of units)
        {
            if (unit == this.y_axis.unit.source) selection = ' selected="true" ';
            else selection = '';

            y_source_unit_combo.append ('<option value="'+unit+'" '+selection+'>'+unit+'</option>');
        }
        // Assumption : it is impossible for the display data not to be set if the source is set
        var kind_of_source = kindOfUnit(this.y_axis.unit.source);

        for (unit of Object.keys(unit_data[kind_of_source]))
        {
            if (unit == this.y_axis.unit.display) selection = ' selected="true" ';
            else selection = '';

            y_display_unit_combo.append ('<option value="'+unit+'" '+selection+'>'+unit+'</option>');
        }
    }
    else
    {
        y_source_unit_combo.append ('<option value="'+empty_source+'">'+empty_source+'</option>');
        for (unit of units)
            y_source_unit_combo.append ('<option value="'+unit+'">'+unit+'</option>');
        y_display_unit_combo.append ('<option value="'+empty_display+'">'+empty_display+'</option>');
    }

    y_source_unit_combo.off("change");
    y_source_unit_combo.change(()=>{me.ySourceSelection();});
    y_display_unit_combo.off("change");
    y_display_unit_combo.change(()=>{me.yDisplaySelection();});
    x_source_unit_combo.off("change");
    x_source_unit_combo.change(()=>{me.xSourceSelection();});
    x_display_unit_combo.off("change");
    x_display_unit_combo.change(()=>{me.xDisplaySelection();});
}

/*---------------------------------------------------------------------------*/
Table2D.prototype.unitsChanged = function (unit_changed)
{
    if (unit_changed == x_unit_changed)
        for (index in this.x) this.x[index] *= this.x_axis.unit.factor
                                               *this.x_axis.unit.revert_factor;
    else
        for (index in this.y) this.y[index] *= this.y_axis.unit.factor
                                               *this.y_axis.unit.revert_factor;

    this.x_axis.min = Math.min(...this.x);
    this.x_axis.max = Math.max(...this.x);
    this.y_axis.min = Math.min(...this.y);
    this.y_axis.max = Math.max(...this.y);

    for (view of this.views) view.reactToUnitsChange();
}