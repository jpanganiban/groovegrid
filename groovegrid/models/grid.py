from groovegrid.models import db


class Grid(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
  tiles = db.relationship('Tile', backref='grid')


class Tile(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  grid_id = db.Column(db.Integer, db.ForeignKey('grid.id'))
  name = db.Column(db.String(256))
