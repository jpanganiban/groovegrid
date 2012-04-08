from flask import Flask, render_template, jsonify, request
from flaskext.mongoalchemy import MongoAlchemy


app = Flask(__name__, template_folder='views')
app.config['MONGOALCHEMY_DATABASE'] = 'groovegrid_dev2'
db = MongoAlchemy(app)


class Grid(db.Document):
  """
  Grids are equivalent to playlists.
  """
  name = db.StringField()

  def to_dict(self):
    return {
          'id': str(self.mongo_id),
          'name': self.name,
        }


class Tile(db.Document):
  """
  Tiles are equivalent to songs.
  """
  grid_id = db.ObjectIdField()
  video_id = db.StringField()
  title = db.StringField()
  thumbnail_url = db.StringField()
  uploader = db.StringField()
  duration = db.IntField()

  def to_dict(self):
    return {
          'id': str(self.mongo_id),
          'grid_id': str(self.grid_id),
          'video_id': self.video_id,
          'title': self.title,
          'thumbnail_url': self.thumbnail_url,
          'uploader': self.uploader,
          'duration': self.duration,
        }


@app.route('/api/grids/<grid_name>')
def api_grid(grid_name):
  grid = Grid.query.filter_by(name=grid_name).first()
  if not grid:
  # Create grid if it doesn't exist
    grid = Grid(name=grid_name)
    grid.save()
  tiles = Tile.query.filter_by(grid_id=str(grid.mongo_id)).all()
  return jsonify({
      'id': str(grid.mongo_id),
      'grid': grid.name,
      'tiles': [tile.to_dict() for tile in tiles]
    })

@app.route('/api/grids/<grid_name>/tiles', methods=['POST'])
def api_grid_tiles(grid_name):
  if request.method.upper() == 'POST':
    grid = Grid.query.filter_by(name=grid_name).first()
    data = request.json
    tile = Tile(grid_id=str(grid.mongo_id),
                video_id=data.get('video_id'),
                title=data.get('title'),
                thumbnail_url=data.get('thumbnail_url'),
                uploader=data.get('uploader'),
                duration=data.get('duration'))
    tile.save()
    return jsonify(tile.to_dict())

@app.route('/')
@app.route('/<grid_name>')
def index(grid_name=None):
  return render_template('index.html')

def start():
  app.run(debug=True)
