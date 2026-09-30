from models import db, User, LaptopRepairOrder, StreamSession, PartReplacementLog, Payment

def init_database(app):
    """Initializes tables and ensures clean database state with zero dummy data."""
    with app.app_context():
        try:
            db.create_all()
        except Exception as err:
            print(f"[Live Fix DB] create_all notice: {err}")
            db.session.rollback()

        # Non-destructive check to add missing columns (e.g. avatar) on existing databases
        try:
            from sqlalchemy import text
            db.session.execute(text("ALTER TABLE users ADD COLUMN avatar TEXT;"))
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
