from flaskext.testing import TestCase
import unittest


class TestIndex(TestCase):

  def create_app(self):
    from groovegrid.server import app
    app.config['TESTING'] = True
    return app

  def test_index(self):
    response = self.client.get('/')
    self.assertEquals(response.status_code, 200)
    self.assertEquals(response.data, 'Groovegrid')


def suite():
  suite = unittest.TestSuite()
  suite.addTest(unittest.makeSuite(TestIndex))
  return suite
