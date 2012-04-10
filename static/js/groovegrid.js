var Groovegrid = { views: {}, models: {}, collections: {} };

Groovegrid.templates = {
  add: function (name, templateString) {
    if (name == 'add' || name == 'grab') throw 'Invalid name: ' + name;
    if (Groovegrid.templates[name]) throw 'Template exists: ' + name;
    Groovegrid.templates[name] = _.template(templateString);
  },
  grab: function() {
    var i;
    var scripts = document.getElementsByTagName('script');
    var l = (scripts !== undefined ? scripts.length : 0);
    var script;
    var trash = [];
    for (i = 0; i < l; i++) {
      script = scripts[i];
      if (script && script.innerHTML && script.id && script.type === 'text/html') {
        Groovegrid.templates.add(script.id, _.trim(script.innerHTML));
        trash.unshift(script);
      }
    }
    for (i = 0, l = trash.length; i < l; i++) {
      trash[i].parentNode.removeChild(trash[i]);
    }
  }
};

(function($, undefined) {

Groovegrid.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    ':gridName': 'grid'
  },
  index: function() {
  },
  grid: function(gridName) {
    Groovegrid.app.setView(new Groovegrid.views.Grid({
      gridName: gridName
    }));
    Groovegrid.app.currentGrid = gridName;
  }
});

Groovegrid.views.App = Backbone.View.extend({
  el: '#app',
  setView: function(view) {
    this.currentView = view;
    this.$el.html(view.render().el);
  }
});

Groovegrid.views.Grid = Backbone.View.extend({
  initialize: function(options) {
    this.gridName = options.gridName;
  },
  render: function() {
    this.$el.html(Groovegrid.templates.grid({
      gridName: this.gridName
    }));
    return this;
  }
});

})(jQuery);
