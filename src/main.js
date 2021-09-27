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

const { app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require ('path');
const { allowedNodeEnvironmentFlags } = require('process');

var name_of_active_file ="";

var app_name = "JSB editor";

var win = {};

var file_is_saved = true;

/* -------------------------------------------------------------------------- */
function createWindow ()
{
  // Create the browser window.
  var path_to_preload = path.join(__dirname, 'preload.js');
  win = new BrowserWindow({ width: 800,
                            height: 600,
                            minWidth : 800,
                            icon:"src/icons/icon.ico",
                            webPreferences : { preload: path_to_preload,
                                               contextIsolation : true}});
  // Uncomment to get the developper tools in the main window
  //win.webContents.openDevTools();

  win.webContents.setWindowOpenHandler(
    ({url})=> { if (url.includes( 'About.html'))
                {
                  return { action : 'allow',
                           overrideBrowserWindowOptions : {fullscreenable : false,
                                                           autoHideMenuBar : true,
                                                           resizable : false,
                                                           webPreferences :{defaultFontSize : '10px'},
                                                           icon : 'src/icons/icon.ico'}
                         };
                }
                else return null;
              });

  // and load the index.html of the app.
  win.setMenu(null);
  win.loadFile('src/main.html');

  ipcMain.on('fileSaveDialog', (event,arg) => {
    event.returnValue = [dialog.showSaveDialogSync({title:"Save JSB file",
                                                    properties:["showOverwriteConfirmation"],
                                                    filters:[{ name: 'JSB files', extensions: ['xml'] }]
                                                    })];
                                              });

  ipcMain.on('fileOpenDialog', (event,arg) => {
    event.returnValue = dialog.showOpenDialogSync({title:"Open JSB file",
                                                  properties:["openFile"],
                                                  filters:[{ name: 'JSB files', extensions: ['xml'] }]
                                                 });
    updateWindowTitle ();
  });

  ipcMain.on('exit', (event,arg) => {app.quit();});

  ipcMain.on('setFileIsSaved', (event,saved) => { file_is_saved = saved;
                                                  updateWindowTitle ();});

  ipcMain.on('fileLoaded', (event,title) => { name_of_active_file = title;
                                              updateWindowTitle ();});

  win.on ('close',
          function (event)
          {
              if (!file_is_saved)
              {
                event.preventDefault();
                var what_to_do =  dialog.showMessageBoxSync({
                                                              title : "Exiting",
                                                              message : "File not saved",
                                                              type : "warning",
                                                              buttons : ["Save", "Discard changes", "Cancel"]
                                                            });
                switch (what_to_do)
                {
                  case 0 :
                    win.webContents.send("save before closing", null);
                  break;
                  case 1 :
                    file_is_saved = true;
                    app.quit();
                  break;
                  default: break;
                }

              }
              else app.quit();
          });

}

/* -------------------------------------------------------------------------- */
function updateWindowTitle ()
{
  if (file_is_saved) var file_status_string = "";
  else var file_status_string = " *";

  if (name_of_active_file != "")
      win.setTitle (app_name+" - "+name_of_active_file+file_status_string);
  else
      win.setTitle (app_name);
}

// --------------------------------------------------------------------------
// Listeners
// --------------------------------------------------------------------------


app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {

  }
});
