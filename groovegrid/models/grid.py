from groovegrid.models import db


class Grid(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))


class Tile(db.Model):
  id = db.Column(db.Integer, primary_key=True)
