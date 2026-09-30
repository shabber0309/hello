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
