from groovegrid.models import db
from groovegrid.server import app
from groovegrid.models.grid import Grid
import unittest


class TestGridModel(unittest.TestCase):

  def setUp(self):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
    db.init_app(app)
    self.ctx = app.test_request_context()
    self.ctx.push()
    db.create_all()

  def tearDown(self):
    db.drop_all()
    self.ctx.pop()

  def test_grid_model(self):
    """Grid model should be able to write and query."""
    grid = Grid(name='Test Grid')
    db.session.add(grid)
    db.session.commit()
    self.assertEquals(grid, Grid.query.filter_by(name='Test Grid').first())





def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestGridModel))
  return suite
