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

const fs = require ('fs');
const {contextBridge, ipcRenderer} = require('electron');
var current_file_name ="";

/* --------------------------------------------------------------------------*/
function XMLfileToString (file_name)
{
   var extension = file_name.split('.').pop();
   if (extension != 'xml') return '';


   try
   {
      var xml_string = fs.readFileSync(file_name, "utf8");
   }
   catch
   {
      return "";
   }
   current_file_name = file_name;
   return xml_string;
}

/* --------------------------------------------------------------------------*/
function XMLStringToFile (string, file_name)
{
   fs.writeFileSync(file_name, string, {encoding : 'utf8'});
}

/* --------------------------------------------------------------------------*/
function getFileNameToOpen ()
{
   return ipcRenderer.sendSync('fileOpenDialog', null);
}

/* --------------------------------------------------------------------------*/
function getFileNameToSave ()
{
   return ipcRenderer.sendSync('fileSaveDialog', null);
}

/* --------------------------------------------------------------------------*/
function fileSave (string)
{
   var sliced = current_file_name.split('.');
   sliced.pop(); // remove extension
   var backup_filename = sliced.join('.')+'.bak';

   //only write backup file once
   if (! fs.existsSync(backup_filename))
      fs.copyFileSync (current_file_name, backup_filename);

   fs.writeFileSync(current_file_name, string, {encoding : 'utf8'});
}

/* --------------------------------------------------------------------------*/
function setFileIsSaved (saved)
{
   ipcRenderer.send('setFileIsSaved', saved);
}

/* --------------------------------------------------------------------------*/
function fileLoaded (name)
{
   ipcRenderer.send('fileLoaded', name);
}

/* --------------------------------------------------------------------------*/
function exit ()
{
   ipcRenderer.send('exit', null);
}

/* --------------------------------------------------------------------------*/
function waitForSaveBeforeExit ()
{
   return ipcRenderer.send('wait-for-save-before-exit', null);
}

// Preload (Isolated World)

contextBridge.exposeInMainWorld(
  'API',
  {
    XMLfileToString : XMLfileToString,
    XMLStringToFile : XMLStringToFile,
    getFileNameToOpen : getFileNameToOpen,
    getFileNameToSave : getFileNameToSave,
    setFileIsSaved : setFileIsSaved,
    fileSave : fileSave,
    fileLoaded : fileLoaded,
    exit : exit
  });


  ipcRenderer.on ("save before closing", ()=>{window.postMessage("save before closing", "*");});
