from setuptools import setup, find_packages


setup(name="Groovegrid",
      description="A realtime colalborative playlist",
      version="1.0",
      author="Jesse Panganiban",
      author_email="me@jpanganiban.com",
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      entry_points={
          'console_scripts': ['groovegrid.debug = groovegrid.server:debug']
        },
      install_requires=[
          'flask',
          'flask-testing',
          'flask-sqlalchemy',
        ],
      test_suite='tests.suite',
      )
