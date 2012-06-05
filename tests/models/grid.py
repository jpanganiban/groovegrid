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

  def test_grid_tile_relationship(self):
    """Grid model should have a proper one-to-many relationship with Tile."""
    grid = Grid(name='Test Grid')
    tile = Tile(name='Test Tile')
    grid.tiles.append(tile)
    db.session.add(tile)
    db.session.add(grid)
    db.session.commit()

    q_grid = Grid.query.filter_by(name='Test Grid').first()
    self.assertTrue(hasattr(q_grid, 'tiles'))
    self.assertEqual(tile, q_grid.tiles[0])


class TestTileModel(BaseModelTestCase):

  def test_tile_model(self):
    """Tile model should be able to write and query."""
    tile = Tile(name='Test Tile')
    db.session.add(tile)
    db.session.commit()
    self.assertEquals(tile, Tile.query.filter_by(name='Test Tile').first())

  def test_tile_grid_relationship(self):
    """Tile model should have a proper one-to-many relationship with Grid"""
    grid = Grid(name='Test Grid')
    tile = Tile(name='Test Tile')
    grid.tiles.append(tile)
    db.session.add(tile)
    db.session.add(grid)
    db.session.commit()

    q_tile = Tile.query.filter_by(name='Test Tile').first()
    self.assertTrue(hasattr(q_tile, 'grid'))
    self.assertEqual(grid, q_tile.grid)

  def test_to_dict(self):
    """Tile to_dict method should return its attributes in dict form."""
    tile = Tile(name='Test Tile')
    dict_tile = {
          'id': tile.id,
          'grid_id': tile.grid_id,
          'name': tile.name,
        }

    self.assertEqual(dict_tile, tile.to_dict())


def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestGridModel))
  suite.addTest(unittest.makeSuite(TestTileModel))
  return suite
