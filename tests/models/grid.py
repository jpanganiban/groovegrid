from groovegrid.models import db
from groovegrid.models.grid import Tile, Grid
from tests.models import BaseModelTestCase
import unittest


class TestGridModel(BaseModelTestCase):

  def test_grid_model(self):
    """Grid model should be able to write and query."""
    grid = Grid(name='Test Grid')
    db.session.add(grid)
    db.session.commit()
    self.assertEquals(grid, Grid.query.filter_by(name='Test Grid').first())


class TestTileModel(BaseModelTestCase):

  def test_tile_model(self):
    """Tile model should be able to write and query."""
    tile = Tile(name='Test Tile')
    db.session.add(tile)
    db.session.commit()
    self.assertEquals(tile, Tile.query.filter_by(name='Test Tile').first())


def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestGridModel))
  suite.addTest(unittest.makeSuite(TestTileModel))
  return suite
