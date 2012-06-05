from flask import Flask
from groovegrid.controllers import index


app = Flask(__name__, template_folder='views')
# Register blueprints
app.register_blueprint(index.app)


def debug(app=app, host='0.0.0.0', port=51000):
  """Console script entry point for 'groovegrid.debug' command."""
  app.run(debug=True, host=host, port=port)
