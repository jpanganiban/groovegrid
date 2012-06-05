from groovegrid.models import db


class Grid(db.Model):
  id = db.Column(db.Integer, primary_key=True)
