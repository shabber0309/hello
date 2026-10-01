from models import db, User, LaptopRepairOrder, StreamSession, PartReplacementLog, Payment, OrderMessage

def init_database(app):
    """Initializes tables and ensures clean database state with zero dummy data."""
    with app.app_context():
        try:
            db.create_all()
        except Exception as err:
            print(f"[Live Fix DB] create_all notice: {err}")
            db.session.rollback()

        # Non-destructive migrations for existing databases (SQLite / PostgreSQL)
        from sqlalchemy import text
        migrations = [
            ("users", "avatar", "TEXT"),
            ("users", "whatsapp", "VARCHAR(30)"),
            ("users", "address", "TEXT"),
            ("users", "city", "VARCHAR(60) DEFAULT 'Hyderabad'"),
            ("users", "landmark", "VARCHAR(150)"),
            ("users", "pincode", "VARCHAR(20)"),
            ("users", "bench_station", "VARCHAR(80)"),
            ("users", "specialization", "VARCHAR(255)"),
            ("users", "certifications", "VARCHAR(255)"),
            ("users", "payout_upi", "VARCHAR(100)"),
            ("users", "experience_years", "INTEGER DEFAULT 5"),
            ("users", "rating", "FLOAT DEFAULT 4.9"),
            ("users", "is_verified", "BOOLEAN DEFAULT TRUE"),
            ("laptop_repair_orders", "base_price_min", "FLOAT DEFAULT 1500.0"),
            ("laptop_repair_orders", "base_price_max", "FLOAT DEFAULT 3500.0"),
            ("laptop_repair_orders", "customer_selected_price", "FLOAT"),
            ("laptop_repair_orders", "final_agreed_price", "FLOAT"),
            ("laptop_repair_orders", "price_status", "VARCHAR(30) DEFAULT 'pending'"),
            ("laptop_repair_orders", "pickup_status", "VARCHAR(30) DEFAULT 'not_requested'"),
            ("laptop_repair_orders", "pickup_scheduled_time", "VARCHAR(100)"),
            ("laptop_repair_orders", "unseal_status", "VARCHAR(30) DEFAULT 'sealed'"),
            ("laptop_repair_orders", "reseal_status", "VARCHAR(30) DEFAULT 'not_resealed'"),
            ("laptop_repair_orders", "reseal_tamper_code", "VARCHAR(50)"),
            ("laptop_repair_orders", "final_rating", "INTEGER"),
            ("laptop_repair_orders", "final_review", "TEXT"),
            ("laptop_repair_orders", "meet_recording_url", "VARCHAR(255)"),
            ("laptop_repair_orders", "meet_recording_sent_to_email", "BOOLEAN DEFAULT FALSE"),
            ("laptop_repair_orders", "pickup_area", "VARCHAR(100)"),
            ("laptop_repair_orders", "pickup_pincode", "VARCHAR(20)"),
            ("laptop_repair_orders", "problem_photos", "TEXT"),
            ("laptop_repair_orders", "device_pin", "VARCHAR(100)"),
            ("laptop_repair_orders", "power_state", "VARCHAR(100) DEFAULT 'Turns On & Boots into OS'"),
            ("laptop_repair_orders", "bitlocker_status", "VARCHAR(100) DEFAULT 'Disabled / Recovery Key Available'"),
            ("laptop_repair_orders", "charger_included", "BOOLEAN DEFAULT FALSE"),
            ("laptop_repair_orders", "charger_details", "VARCHAR(150)"),
            ("laptop_repair_orders", "included_accessories", "TEXT"),
            ("laptop_repair_orders", "pre_existing_damage", "TEXT"),
            ("laptop_repair_orders", "data_backup_status", "VARCHAR(100) DEFAULT 'Customer Confirmed Backup (Diagnostic Waiver Signed)'"),
            ("laptop_repair_orders", "chassis_open_consent", "BOOLEAN DEFAULT TRUE"),
            ("laptop_repair_orders", "part_preference", "VARCHAR(100) DEFAULT 'OEM Original (100% Genuine with Brand Warranty)'"),
            ("laptop_repair_orders", "whatsapp_number", "VARCHAR(30)"),
            ("laptop_repair_orders", "pickup_landmark", "VARCHAR(200)"),
            ("laptop_repair_orders", "credentials_requested", "BOOLEAN DEFAULT FALSE"),
            ("laptop_repair_orders", "credentials_request_note", "VARCHAR(255)"),
            ("laptop_repair_orders", "credentials_provided", "BOOLEAN DEFAULT FALSE"),
            ("laptop_repair_orders", "charger_photos", "TEXT"),
            ("laptop_repair_orders", "accessory_photos", "TEXT"),
        ]
        for tbl, col, col_def in migrations:
            try:
                db.session.execute(text(f"ALTER TABLE {tbl} ADD COLUMN {col} {col_def};"))
                db.session.commit()
            except Exception:
                db.session.rollback()

        seed_clean_admin()


def seed_clean_admin():
    """Initializes an administrative account if none exists, with zero dummy/demo orders."""
    admin_user = User.query.filter_by(role="admin").first()
    if not admin_user:
        admin = User(
            name="Administrator",
            username="admin",
            email="admin@livefix.com",
            phone="+91 90000 00000",
            role="admin"
        )
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        print("[Live Fix DB] Clean Administrator account initialized.")


# Aliases for backward compatibility
seed_demo_data = seed_clean_admin
seed_admin_user = seed_clean_admin
