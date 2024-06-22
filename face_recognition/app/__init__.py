from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os

db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:250802@localhost/attendance_facial_recognition_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, '..', 'uploads')
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        from . import routes, models
        db.create_all()
        routes.init_routes(app)

    return app