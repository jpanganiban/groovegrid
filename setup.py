from setuptools import setup, find_packages


setup(name="Groovegrid",
      description="A realtime colalborative playlist",
      version="1.0",
      author="Jesse Panganiban",
      author_email="me@jpanganiban.com",
      packages=find_packages(),
      py_modules=['groovegrid'],
      install_requires=[
          'flask',
          'gevent',
          'gevent_zeromq',
        ],
      )
