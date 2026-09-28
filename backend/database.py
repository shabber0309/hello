from models import db, User, LaptopRepairOrder, StreamSession, PartReplacementLog, Payment

def init_database(app):
    """Initializes tables and ensures primary Admin Shabber exists in the database."""
    with app.app_context():
        try:
            db.create_all()
            test_user = User.query.first()
        except Exception:
            db.session.rollback()
            db.drop_all()
            db.create_all()

        seed_admin_user()


def seed_admin_user():
    """Ensures primary Admin Shabber exists with zero dummy customers, technicians, or mock orders."""
    admin_user = User.query.filter_by(username="shabber").first()
    if not admin_user:
        admin = User(
            name="Shabber Hussain",
            username="shabber",
            email="shabberhussain934@gmail.com",
            phone="+91 98765 43210",
            role="admin"
        )
        admin.set_password("123123123")
        db.session.add(admin)
        db.session.commit()
        print("[FixConnect DB] Admin Shabber verified in database. No dummy data seeded.")
    else:
        print("[FixConnect DB] Database clean - Admin Shabber active. No dummy data.")


# Alias
seed_demo_data = seed_admin_user
