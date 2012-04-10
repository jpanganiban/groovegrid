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

  def to_dict(self):
    return {'id': str(self.mongo_id),
            'title': self.title,
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

@app.route('/')
@app.route('/<grid_name>')
def index(grid_name=None):
  return render_template('index.html')

def start():
  app.run(debug=True, port=51000)
