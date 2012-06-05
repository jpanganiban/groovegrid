from flask import Flask
from groovegrid.models import db
from groovegrid.controllers import index


app = Flask(__name__, template_folder='views')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///groovegrid.db'
# Attach db
db.init_app(app)
# Register blueprints
app.register_blueprint(index.app)


def debug(app=app, host='0.0.0.0', port=51000):
  """Console script entry point for 'groovegrid.debug' command."""
  app.run(debug=True, host=host, port=port)
