 "use strict";
 
 var interpreter = interpreter || {};
 
 interpreter.outf = function(text) { 
   var mypre = document.getElementById("output"); 
   mypre.innerHTML = mypre.innerHTML + text; 
 } 
 interpreter.builtinRead = function(x) {
   if (Sk.builtinFiles === undefined || 
       Sk.builtinFiles["files"][x] === undefined)
           throw "File not found: '" + x + "'";
   return Sk.builtinFiles["files"][x];
 }
 
 interpreter.runit = function() { 
   var prog = codemirrorAccess.codeMirrorObject.getValue(); 
   var mypre = document.getElementById("output"); 
   mypre.innerHTML = ''; 
   Sk.canvas = "mycanvas";
   Sk.pre = "output";
   Sk.configure({output:interpreter.outf, read:interpreter.builtinRead}); 
   try {
      eval(Sk.importMainWithBody("<stdin>",false,prog)); 
   }
   catch(e) {
       alert(e.toString())
   }
 }