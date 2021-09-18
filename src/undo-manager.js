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

var actions_stack = [];

/*---------------------------------------------------------------------------*/
function Action (direct, reverse)
{
    this.direct = direct;
    this.reverse = reverse;
    this.context = null;
}

/*---------------------------------------------------------------------------*/
Action.prototype.execute = function(context, ...parameters)
{
    if (!context.hasOwnProperty('target')) return;

    this.direct.call (context.target, ...parameters);
    actions_stack.push (this);
    this.context = context;
    window.API.setFileIsSaved (false);
}

/*---------------------------------------------------------------------------*/
function undoAction ()
{
    if (actions_stack.length != 0)
        var action_undone = actions_stack.pop();
    else return;

    action_undone.reverse.call (action_undone.context.target,
                                action_undone.context);
}

