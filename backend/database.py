from models import db, User, LaptopRepairOrder, StreamSession, PartReplacementLog, Payment

def init_database(app):
    """Initializes tables and ensures clean database state with zero dummy data."""
    with app.app_context():
        try:
            db.create_all()
            _ = User.query.first()
        except Exception:
            db.session.rollback()
            db.drop_all()
            db.create_all()

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
