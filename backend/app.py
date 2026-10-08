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
from routes.device_lookup import device_bp

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
    app.register_blueprint(device_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'Live Fix API - Verified Transparent Laptop Care',
            'version': '2.0.0',
            'database': 'Connected'
        }), 200

    # Serve React Frontend Build in Production if present
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    if os.path.exists(frontend_dist):
        from flask import send_from_directory

        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_frontend(path):
            if path and not path.startswith('api') and os.path.exists(os.path.join(frontend_dist, path)):
                return send_from_directory(frontend_dist, path)
            if not path.startswith('api'):
                return send_from_directory(frontend_dist, 'index.html')
            return jsonify({'error': 'API endpoint not found'}), 404

    # Initialize database tables outside of app.py
    init_database(app)

    return app


# WSGI application instance for production (Gunicorn / Render)
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Live Fix 7-Stage Zero-Trust Lifecycle Active
    app.run(host='0.0.0.0', port=port, debug=True)

