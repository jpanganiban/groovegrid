from setuptools import setup


setup(name='Groovegrid',
      description='A realtime collaborative playlist',
      version='0.1',
      author='Jesse Panganiban',
      author_email='me@jpanganiban.com',
      py_modules=['groovegrid'],
      entry_points={
          'console_scripts': ['groovegrid = groovegrid:start']
        },
      install_requires=[
          'flask',
          'flask-mongoalchemy',
        ],
      )
