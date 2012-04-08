from flask import Flask, render_template
from flaskext.mongoalchemy import MongoAlchemy


app = Flask(__name__, template_folder='views')
app.config['MONGOALCHEMY_DATABASE'] = 'groovegrid_dev'
db = MongoAlchemy(app)


class Grid(db.Document):
  """
  Grids are equivalent to playlists.
  """
  name = db.StringField()

  def to_dict(self):
    return {
          'id': str(self.id),
          'name': self.name,
        }


class Tile(db.Document):
  """
  Tiles are equivalent to songs.
  """
  grid_id = db.ObjectIdField()
  video_id = db.StringField()

  def to_dict(self):
    return {
          'id': str(self.id),
          'grid_id': str(self.grid_id),
          'video_id': self.video_id,
        }


@app.route('/')
def index():
  return render_template('index.html')

def start():
  app.run(debug=True)
