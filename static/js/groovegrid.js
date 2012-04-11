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
    new Groovegrid.views.Search().render();
  }
});

Groovegrid.views.App = Backbone.View.extend({
  el: '#app',
  setView: function(view) {
    this.currentView = view;
    this.$el.html(view.render().el);
  }
});

Groovegrid.models.SearchResult = Backbone.Model.extend();

Groovegrid.collections.SearchResults = Backbone.Collection.extend({
  model: Groovegrid.models.SearchResult
});

Groovegrid.models.SearchQuery = Backbone.Model.extend({
  parse: function(response) {
    response.results = new Groovegrid.collections.SearchResults(response);
    return response;
  }
});

Groovegrid.views.SearchResult = Backbone.View.extend({
  tagName: 'div',
  className: 'search-result',
  events: {
    'click': 'addTrack'
  },
  render: function() {
    var data = this.model.toJSON();
    this.$el.html(Groovegrid.templates.searchResult(data));
    this.tiles = Groovegrid.app.currentView.tiles.collection;
    return this;
  },
  addTrack: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = this.model.toJSON();
    this.tiles.create({
      artwork_url: data.artwork_url || '',
      duration: data.duration,
      song_id: data.id,
      song_uri: data.uri,
      stream_url: data.stream_url,
      title: data.title,
      user: data.user.username,
    });
    this.options.resultsView.$el.empty();
    this.options.resultsView.options.searchView.$('input[type=text]').val('');
  }
});

Groovegrid.views.SearchResults = Backbone.View.extend({
  el: '#results',
  add: function(model) {
    var view = new Groovegrid.views.SearchResult({
      model: model,
      resultsView: this
    });
    this.$el.append(view.render().el);
  },
  render: function() {
    this.$el.empty();
    this.collection.each(this.add, this);
    return this;
  }
});

Groovegrid.views.Search = Backbone.View.extend({
  el: '#search',
  events: {
    'blur input[type=text]': 'search'
  },
  initialize: function() {
    this.model = new Groovegrid.models.SearchQuery();
    this.queryUrl = 'http://api.soundcloud.com/tracks.json?' +
                    'client_id=ea059f15567c5e19dd370a48b0fab0d2' + 
                    '&filter=streamable';
  },
  render: function() {
    this.$el.html(Groovegrid.templates.search());
    return this;
  },
  search: function() {
    var queryString = this.$('input[type=text]').val();
    this.model.url = _.bind(function() {
      return this.queryUrl + '&q=' + queryString;
    }, this);
    this.model.fetch({success: _.bind(function(response) {
      this.results = new Groovegrid.views.SearchResults({
        collection: response.get('results'),
        searchView: this
      }).render();
    }, this)});
  }
});

Groovegrid.models.Tile = Backbone.Model.extend();

Groovegrid.collections.Tiles = Backbone.Collection.extend({
  model: Groovegrid.models.Tile,
  url: function() {
    return '/api/grids/' + this.gridName + '/tiles'
  }
});

Groovegrid.models.Grid = Backbone.Model.extend({
  url: function() {
    return '/api/grids/' + this.gridName;
  },
  parse: function(response) {
    response.tiles = new Groovegrid.collections.Tiles(response.tiles);
    response.tiles.gridName = this.gridName;
    return response;
  }
});

Groovegrid.views.Tile = Backbone.View.extend({
  tagName: 'div',
  className: 'tile',
  render: function() {
    var data = this.model.toJSON();
    this.$el.html(Groovegrid.templates.tile(data));
    return this;
  }
});

Groovegrid.views.Tiles = Backbone.View.extend({
  el: '#tiles',
  initalize: function() {
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.add, this);
  },
  add: function(model) {
    var view = new Groovegrid.views.Tile({
      model: model
    });
    this.$el.append(view.render().el);
  },
  render: function(collection) {
    var collection = collection || this.collection
    this.$el.empty();
    collection.each(this.add, this);
    return this;
  }
});

Groovegrid.views.Grid = Backbone.View.extend({
  initialize: function(options) {
    this.gridName = options.gridName;
    this.model = new Groovegrid.models.Grid();
    this.model.gridName = this.gridName;
    this.model.on('change', this.renderModel, this);
    this.model.fetch();
  },
  render: function() {
    this.$el.html(Groovegrid.templates.grid({
      gridName: this.gridName
    }));
    return this;
  },
  renderModel: function(model) {
    this.tiles = new Groovegrid.views.Tiles({
      collection: this.model.get('tiles')
    }).render();
  }
});

})(jQuery);
