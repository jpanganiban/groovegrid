from flask import Flask, request
import gevent

app = Flask(__name__, template_folder='views')


@app.route('/')
def index():
  return 'Groovegrid'

def debug(app=app, host='0.0.0.0', port=51000):
  app.run(debug=True, host=host, port=port)
