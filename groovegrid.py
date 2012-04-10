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


@app.route('/')
@app.route('/<grid_name>')
def index(grid_name=None):
  return render_template('index.html')

def start():
  app.run(debug=True, port=51000)
