import os
import random
import datetime
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, LaptopRepairOrder, StreamSession, PartReplacementLog, Payment
from routes.auth import auth_bp
from routes.repair import repair_bp
from routes.stream import stream_bp
from routes.payment import payment_bp
from routes.admin import admin_bp

from database import init_database

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for front-end integration
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize Database
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(repair_bp)
    app.register_blueprint(stream_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(admin_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'FixConnect API - Verified Transparent Laptop Care',
            'version': '2.0.0',
            'database': 'Connected'
        }), 200

    # Initialize database tables and Admin Shabber outside of app.py
    init_database(app)

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"FixConnect Live Hardware Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
