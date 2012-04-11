from flask import Flask, render_template, jsonify, request
from flaskext.mongoalchemy import MongoAlchemy


app = Flask(__name__, template_folder='views')
app.config['MONGOALCHEMY_DATABASE'] = 'groovegrid_dev3'
db = MongoAlchemy(app)


class Grid(db.Document):
  name = db.StringField()

  def to_dict(self):
    return {'id': str(self.mongo_id),
            'name': self.name,
           }


class Tile(db.Document):
  grid_id = db.ObjectIdField()
  title = db.StringField()
  artwork_url = db.StringField()
  duration = db.IntField()
  song_uri = db.StringField()
  stream_url = db.StringField()
  user = db.StringField()
  song_id = db.IntField()

  def to_dict(self):
    return {'id': str(self.mongo_id),
            'song_id': self.song_id,
            'title': self.title,
            'artwork_url': self.artwork_url,
            'duration': self.duration,
            'song_uri': self.song_uri,
            'stream_url': self.stream_url,
            'user': self.user,
           }


@app.route('/api/grids')
@app.route('/api/grids/<grid_name>')
def api_grid(grid_name=None):
  if grid_name:
    grid = Grid.query.filter_by(name=grid_name).first()
    if not grid:
    # Create grid if it doesn't exist
      grid = Grid(name=grid_name)
      grid.save()
    tiles = Tile.query.filter_by(grid_id=str(grid.mongo_id)).all()
    return jsonify({
        'grid': grid.to_dict(),
        'tiles': [tile.to_dict() for tile in tiles],
      })
  elif not grid_name:
    grids = Grid.query.all()
    print grids
    return jsonify({
        'grids': [grid.to_dict() for grid in grids],
      })

@app.route('/api/grids/<grid_name>/tiles', methods=['POST'])
def api_grid_tiles(grid_name):
  if request.method.upper() == 'POST':
    data = request.json
    grid = Grid.query.filter_by(name=grid_name).first()
    data['grid_id'] = str(grid.mongo_id)
    tile = Tile(**data)
    tile.save()
    return jsonify(tile.to_dict())

@app.route('/')
@app.route('/<grid_name>')
def index(grid_name=None):
  return render_template('index.html')

@app.route('/sandbox')
def sandbox():
  # This is a route to test layout
  return render_template('grid.html')

def start():
  app.run(debug=True, port=51000)
