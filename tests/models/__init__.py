from groovegrid.models import db
from groovegrid.server import app
import unittest


class TestModelRequirements(unittest.TestCase):

  def test_db_instance(self):
    """Check for db instance in the models package."""
    from groovegrid import models
    self.assertTrue(hasattr(models, 'db'))

  def test_app_db_config(self):
    """Check application if it has the necessary config."""
    from groovegrid.server import app
    x = app.config.get('SQLALCHEMY_DATABASE_URI')
    self.assertTrue(app.config.get('SQLALCHEMY_DATABASE_URI'))



class BaseModelTestCase(unittest.TestCase):
  """Base model for testing models."""

  def setUp(self):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
    db.init_app(app)
    self.ctx = app.test_request_context()
    self.ctx.push()
    db.create_all()

  def tearDown(self):
    db.drop_all()
    self.ctx.pop()


def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestModelRequirements))
  return suite
