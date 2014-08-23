 "use strict";

var rtaccess = rtaccess || {};

// This function is called the first time that the Realtime model is created
// for a file.
rtaccess.initializeModel = function(model) {
  var sharedString = model.createString('print "hello world"');
  model.getRoot().set('code', sharedString);
}

// This function is called when the Realtime file has been loaded.
rtaccess.onFileLoaded = function(doc) {
  var string = doc.getModel().getRoot().get('code');
  
  codemirrorAccess.init(string);
  
  var runButton = document.getElementById('runButton');
  runButton.onclick = function(e) {
    interpreter.runit();  
  };
  runButton.removeAttribute('disabled')
  
  var shareButton = document.getElementById('shareButton');
  shareButton.onclick = function(e) {
    prompt("Give this link to the other person", document.URL);
  };
  shareButton.removeAttribute('disabled')
  
  var updateTextArea = function(e) {
    var cursor = codemirrorAccess.codeMirrorObject.getCursor();
    codemirrorAccess.codeMirrorObject.setValue(string.getText());
    codemirrorAccess.codeMirrorObject.setCursor(cursor);
  };
  string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, 
                          updateTextArea);
  string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, 
                          updateTextArea);

  // Add logic for undo button.
  var model = doc.getModel();
  var undoButton = document.getElementById('undoButton');
  var redoButton = document.getElementById('redoButton');
  undoButton.onclick = function(e) {
    model.undo();
  };
  redoButton.onclick = function(e) {
    model.redo();
  };

  // Add event handler for UndoRedoStateChanged events.
  var onUndoRedoStateChanged = function(e) {
    if (e.canUndo) {
      undoButton.removeAttribute('disabled');
    }
    else {
      undoButton.setAttribute("disabled", true);
    }
    if (e.canRedo) {
      redoButton.removeAttribute('disabled');
    }
    else {
      redoButton.setAttribute("disabled", true);
    }
  };
  model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, 
                         onUndoRedoStateChanged);
  document.getElementById('loader-gif').style.display = "none";
  document.getElementById('editor-hide').style.visibility = "visible";
}
 
rtaccess.afterAuthFunc = function() {
  document.getElementById('loader-gif').style.display = "block";
}

// Options for the Realtime loader.
rtaccess.realtimeOptions = {
  // Client ID from the console.
  clientId: '351900000929-isdo9c2d86thju282siblvgug7mm1egg.apps.googleusercontent.com',

  // The ID of the button to click to authorize. Must be a DOM element ID.
  authButtonElementId: 'authorizeButton',

  // Function to be called when a Realtime model is first created.
  initializeModel: rtaccess.initializeModel,

  //Autocreate files right after auth automatically.
  autoCreate: true,

  // The name of newly created Drive files.
  defaultTitle: "PyEditor-File",

  // The MIME type of newly created Drive Files. By default the application
  // specific MIME type will be used:
  //     application/vnd.google-apps.drive-sdk.
  newFileMimeType: null, // Using default.

  onFileLoaded: rtaccess.onFileLoaded,

  // Function to be called to inityalize custom Collaborative Objects types.
  registerTypes: null, // No action.

  afterAuth: rtaccess.afterAuthFunc
}

rtaccess.startRealtime = function() {
  var realtimeLoader = new rtclient.RealtimeLoader(rtaccess.realtimeOptions);
  realtimeLoader.start();
}