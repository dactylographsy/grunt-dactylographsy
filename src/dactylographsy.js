/*global window, document*/

;(function(root, window, document, undefined) {
  "use strict";

  var
    Dactylographsy,
    previousDactylographsy = root.Dactylographsy,
    injected = {
      css: {},
      js: {}
    };

  Dactylographsy = function(obj) {
    // If already instance return
    if (obj instanceof Dactylographsy) { return obj; }
    // Otherwise creates new instance
    if (!(this instanceof Dactylographsy)) { return new Dactylographsy(obj); }

    // for chaining
    this._wrapped = obj;
   };

   // Create yerself
   root.Dactylographsy = Dactylographsy;
   // Version of our library
   Dactylographsy.VERSION   = '<%= pkg.version %>';

   // Tries to resolve version conflicts by restoring the previously loaded version globally
   Dactylographsy.noConflict = function() {
     // Retore the `previousScandio`
     root.Dactylographsy = previousDactylographsy;

     // Return yerself to continue
     return this;
   };
}(this, window, document));
