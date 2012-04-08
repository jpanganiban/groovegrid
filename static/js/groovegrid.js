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
    ':gridName': 'gridView'
  }, 
  index: function() {
    var view = new Groovegrid.views.Index;
    Groovegrid.app.setContentView(view);
  },
  gridView: function(gridName) {
    var view = new Groovegrid.views.GridView;
    Groovegrid.app.setContentView(view);

    new Groovegrid.views.Search({
      el: '#search'
    }).render();
  }
});

Groovegrid.views.App = Backbone.View.extend({
  el: '#groovegrid',
  setContentView: function(view) {
    this.contentView = view;
    this.$el.html(view.render().el);
  }
});

Groovegrid.views.Index = Backbone.View.extend({
  render: function() {
    this.$el.html(Groovegrid.templates.index());
    return this;
  }
});

Groovegrid.models.SearchResult = Backbone.Model.extend();

Groovegrid.collections.SearchResults = Backbone.Collection.extend();

Groovegrid.models.SearchQuery = Backbone.Model.extend({
  parse: function(response) {
    response.result = new Groovegrid.collections.SearchResults(response.data.items);
    return response;
  }
});

Groovegrid.views.SearchResult = Backbone.View.extend({
  render: function() {
    var data = this.model.toJSON();
    console.log(data);
    this.$el.html(Groovegrid.templates.searchResult(data));
    return this;
  }
});

Groovegrid.views.SearchResults = Backbone.View.extend({
  el: '#results',
  initialize: function() {
    this.collection.on('reset', this.render, this);
  },
  add: function(model) {
    var view = new Groovegrid.views.SearchResult({
      model: model
    }).render();
    this.$el.append(view.el);
  },
  render: function(collection) {
    var collection = collection || this.collection;
    this.$el.empty();
    collection.each(this.add, this);
    return this;
  }
});

Groovegrid.views.Search = Backbone.View.extend({
  events: {
    'blur input[type=text]': 'searchVideo'
  },
  initialize: function() {
    this.model = new Groovegrid.models.SearchQuery;
    this.model.on('change', this.setResult, this);
  },
  render: function() {
    this.$el.html(Groovegrid.templates.search());
    return this;
  },
  searchVideo: function() {
    var searchURL = 'https://gdata.youtube.com/feeds/api/videos';
    var query = this.$('input[type=text]').val();
    // set max results to 10
    var maxResults = '10';
    var searchResponse;
    if (!_.isBlank(query)) {
      // Set query url
      var queryURL = searchURL + '?q=' + query + 
        '&max-results=' + maxResults + 
        '&v=2' + '&alt=jsonc';
      this.model.url = queryURL;
      this.model.fetch();
    }
  },
  setResult: function(model) {
    new Groovegrid.views.SearchResults({
      collection: model.get('result')
    }).render();
  }
});

Groovegrid.views.GridView = Backbone.View.extend({
  render: function() {
    this.$el.html(Groovegrid.templates.grid());
    return this;
  }
});

})(jQuery);
