from flask import Blueprint


app = Blueprint('index', __name__, template_folder='views')


@app.route('/')
def index():
  return 'Groovegrid'
