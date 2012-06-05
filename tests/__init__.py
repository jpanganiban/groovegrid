from werkzeug.utils import import_string, find_modules
import unittest


def iter_modules():
  """Returns a generator of test modules."""
  for module in find_modules(__name__, recursive=True):
    mod = import_string(module)
    if hasattr(mod, 'suite'):
      yield mod.suite()


def suite():
  """Test entry point."""
  suite = unittest.TestSuite()
  for other_suite in iter_modules():
    suite.addTest(other_suite)
  return suite
