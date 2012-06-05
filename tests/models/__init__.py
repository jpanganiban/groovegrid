import unittest


class TestModelRequirements(unittest.TestCase):

  def test_sqlalchemy_module(self):
    """Check if sqlalchemy module exists."""
    from flask import ext
    self.assertTrue(hasattr(ext, 'sqlalchemy'))

  def test_db_instance(self):
    """Check for db instance in the models package."""
    from groovegrid import models
    self.assertTrue(hasattr(models, 'db'))

  def test_app_db_config(self):
    """Check application if it has the necessary config."""
    from groovegrid.server import app
    x = app.config.get('SQLALCHEMY_DATABASE_URI')
    self.assertTrue(app.config.get('SQLALCHEMY_DATABASE_URI'))


def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestModelRequirements))
  return suite
