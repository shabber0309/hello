import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Auto-load .env file if present
_env_path = os.path.join(BASE_DIR, '.env')
if os.path.exists(_env_path):
    try:
        with open(_env_path, 'r', encoding='utf-8') as _env_f:
            for _raw_line in _env_f:
                _line = _raw_line.strip()
                if _line and not _line.startswith('#') and '=' in _line:
                    _k, _v = _line.split('=', 1)
                    _k_clean = _k.strip()
                    if _k_clean not in os.environ:
                        os.environ[_k_clean] = _v.strip().strip("'\"")
    except Exception as _env_err:
        print(f"Notice: Could not load .env file: {_env_err}")

class Config:
    """System configuration for Live Fix API."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'livefix-super-secret-jwt-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'livefix-jwt-access-secret-token')
    JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))

    # MySQL connection configuration (can be overridden with DATABASE_URL env)
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'livefix_db')
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.environ.get('MYSQL_PORT', '3306')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'livefix_db')

    # Database connection resolution
    # 1. External cloud DB via DATABASE_URL (Render PostgreSQL, Supabase, Neon, etc.)
    # 2. Dedicated MySQL if USE_MYSQL is true
    # 3. Local SQLite file for zero-friction local development
    _db_url = os.environ.get('DATABASE_URL')
    USE_MYSQL = os.environ.get('USE_MYSQL', 'false').lower() == 'true'

    if _db_url:
        # SQLAlchemy 1.4+ / 2.0 requires 'postgresql://' instead of legacy 'postgres://'
        if _db_url.startswith("postgres://"):
            _db_url = _db_url.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = _db_url
    elif USE_MYSQL:
        SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    else:
        # Default zero-friction local SQLite file database
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'livefix.db')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Google API Key (for Google Cloud / Gemini AI / Maps)
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY', '')
    # Google Meet API credentials path (optional service account or OAuth client secrets)
    GOOGLE_CREDENTIALS_FILE = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', os.path.join(BASE_DIR, 'google_credentials.json'))
    GOOGLE_CALENDAR_ID = os.environ.get('GOOGLE_CALENDAR_ID', 'primary')

    # Email / Gmail SMTP Configuration for OTP Authentication
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'shabber12396@gmail.com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'wkwzifnnfzfjxrdp')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'shabber12396@gmail.com')

    # Razorpay & Store UPI Configuration
    RAZORPAY_MID = os.environ.get('RAZORPAY_MID', 'Tfw8efs0GjjqBQ')
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_TgJilFyDTJEMzP')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'eaZjzBw6hEyEckgKRLde6tKP')
    STORE_UPI_ID = os.environ.get('STORE_UPI_ID', '9704039617@fam')
