 "use strict";
 
var codemirrorAccess = codemirrorAccess || {};
 
codemirrorAccess.codeMirrorObject = null;
 
codemirrorAccess.init = function(sharedString) {
  var textArea = document.getElementById('editor');
  codemirrorAccess.codeMirrorObject = CodeMirror.fromTextArea(textArea, {
    value: sharedString.getText(),
    mode: {name: "python",
      version: 2,
      singleLineStringErrors: false},
    lineNumbers: true,
    indentUnit: 4,
    tabMode: "shift",
    matchBrackets: true
  });
  codemirrorAccess.codeMirrorObject.on("change", function() {
    sharedString.setText(codemirrorAccess.codeMirrorObject.getValue());
  });   
}