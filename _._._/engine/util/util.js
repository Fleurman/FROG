var error = console.error;
var warning = console.warn;


importScript(__("util/lib/polyfills.js"));

importScript(__("util/lib/eventlisten.js"));

importScript(__("util/lib/properties.js"));

importScript(__("util/lib/urlhash.js"));

importScript(__("util/lib/cache.js"));

importScript(__("util/lib/strings.js"));

importScript(__("util/lib/tests.js"));

var Sorting = {
    natural: function(a,b){return a.localeCompare(b);},
    reverse: function(a,b){return b.localeCompare(a);},
    random: function(a,b){return Math.random > 0.5 ? -1 : 1;}
};

if (!HTMLElement.prototype.remove) {
  HTMLElement.prototype.remove = function() {
      this.parentElement.removeChild(this);
  };
}
if (!HTMLElement.prototype.replace) {
  HTMLElement.prototype.replace = function(content) {
    this.insertAdjacentHTML('beforebegin',content);
    this.remove();
  };
}