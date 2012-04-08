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
    var view = new Groovegrid.views.Index({
      tagName: 'div',
      id: 'index'
    });
    Groovegrid.app.setContentView(view);
  },
  gridView: function(gridName) {
    Groovegrid.app.currentGridName = gridName;
    var view = new Groovegrid.views.GridView({
      el: '#groovegrid'
    });
    Groovegrid.app.setContentView(view);

    new Groovegrid.views.Search({
      el: '#search'
    }).render();
  }
});

Groovegrid.views.App = Backbone.View.extend({
  el: '#app',
  setContentView: function(view) {
    this.currentGrid = view;
    this.$el.empty();
    this.$el.html(view.render().el);
  }
});

Groovegrid.views.Index = Backbone.View.extend({
  events: {
    'click input[type=submit]': 'goGrid'
  },
  render: function() {
    this.$el.html(Groovegrid.templates.index());
    return this;
  },
  goGrid: function(e) {
    e.preventDefault();
    var gridName = this.$('input[type=text]').val();
    // FIXME: The router should be able to set the 
    // route correctly.
    window.location = '/' + gridName;
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
  events: {
    'click': 'addTile'
  },
  render: function() {
    var data = this.model.toJSON();
    this.$el.html(Groovegrid.templates.searchResult(data));
    return this;
  },
  addTile: function(e) {
    e.preventDefault();
    var data = this.model.toJSON();
    var tiles = Groovegrid.app.currentGrid.tiles.collection;
    tiles.create({
      video_id: data.id,
      title: data.title,
      thumbnail_url: data.thumbnail.sqDefault,
      uploader: data.uploader,
      duration: data.duration
    }, {wait: true});
    // Close results when entry is added
    var parentView = this.options.parentView;
    parentView.$el.empty();
    parentView.options.searchView.$('input[type=text]').val('');
  }
});

Groovegrid.views.SearchResults = Backbone.View.extend({
  el: '#results',
  initialize: function() {
    this.collection.on('reset', this.render, this);
  },
  add: function(model) {
    var view = new Groovegrid.views.SearchResult({
      model: model,
      parentView: this
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
    } else {
      this.$('#results').empty();
    }
  },
  setResult: function(model) {
    new Groovegrid.views.SearchResults({
      collection: model.get('result'),
      searchView: this
    }).render();
  }
});

Groovegrid.models.Tile = Backbone.Model.extend();

Groovegrid.collections.Tiles = Backbone.Collection.extend({
  model: Groovegrid.models.Tile,
  url: function() {
    return '/api/grids/' + Groovegrid.app.currentGridName + '/tiles';
  }
});

Groovegrid.models.Grid = Backbone.Model.extend({
  url: function() {
    return '/api/grids/' + Groovegrid.app.currentGridName;
  },
  parse: function(response) {
    response.tiles = new Groovegrid.collections.Tiles(response.tiles);
    return response;
  }
});

Groovegrid.views.Tile = Backbone.View.extend({
  events: {
    'click .delete': 'removeTile'
  },
  render: function() {
    var data = this.model.toJSON();
    this.$el.html(Groovegrid.templates.tile(data));
    return this;
  },
  removeTile: function(e) {
    e.preventDefault();
    this.model.destroy();
    this.remove();
  }
});

Groovegrid.views.Tiles = Backbone.View.extend({
  initialize: function() {
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.add, this);
  },
  add: function(model) {
    var view = new Groovegrid.views.Tile({
      className: 'tile',
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

Groovegrid.views.GridView = Backbone.View.extend({
  initialize: function() {
    this.model = new Groovegrid.models.Grid;
    this.model.on('change', this.renderModel, this);
    this.model.fetch();
  },
  render: function() {
    this.$el.html(Groovegrid.templates.grid());
    return this;
  },
  renderModel: function(model) {
    this.tiles = new Groovegrid.views.Tiles({
      el: '#tiles',
      collection: model.get('tiles')
    }).render();
  }
});

})(jQuery);
