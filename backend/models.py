import json
import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(60), unique=True, nullable=True, index=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='customer')  # 'customer', 'technician', 'admin'
    avatar = db.Column(db.Text, nullable=True)
    whatsapp = db.Column(db.String(30), nullable=True)
    address = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(60), default='Hyderabad')
    landmark = db.Column(db.String(150), nullable=True)
    pincode = db.Column(db.String(20), nullable=True)

    # Technician Professional Profile Attributes
    bench_station = db.Column(db.String(80), nullable=True)
    specialization = db.Column(db.String(255), nullable=True)
    certifications = db.Column(db.String(255), nullable=True)
    payout_upi = db.Column(db.String(100), nullable=True)
    experience_years = db.Column(db.Integer, default=5)
    rating = db.Column(db.Float, default=4.9)
    is_verified = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationships
    orders = db.relationship('LaptopRepairOrder', backref='customer', lazy=True, foreign_keys='LaptopRepairOrder.customer_id')
    assigned_repairs = db.relationship('LaptopRepairOrder', backref='technician', lazy=True, foreign_keys='LaptopRepairOrder.technician_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        # Aggregate customer stats
        cust_orders = self.orders or []
        cust_total_orders = len(cust_orders)
        cust_active_orders = len([o for o in cust_orders if o.status not in ['Delivered', 'Cancelled']])
        cust_completed_orders = len([o for o in cust_orders if o.status == 'Delivered'])
        cust_total_spend = sum([
            float(o.final_agreed_price or o.customer_selected_price or o.quote_amount or 0.0)
            for o in cust_orders
        ])
        cust_order_numbers = [o.order_number for o in cust_orders]
        last_order = cust_orders[-1] if cust_orders else None

        # Aggregate technician stats
        tech_jobs = self.assigned_repairs or []
        tech_assigned_count = len(tech_jobs)
        tech_active_count = len([o for o in tech_jobs if o.status not in ['Delivered', 'Cancelled']])
        tech_completed_count = len([o for o in tech_jobs if o.status == 'Delivered'])
        tech_gross_volume = sum([
            float(o.final_agreed_price or o.customer_selected_price or o.quote_amount or 0.0)
            for o in tech_jobs
        ])
        tech_net_earnings = round(tech_gross_volume * 0.90, 2)
        tech_order_numbers = [o.order_number for o in tech_jobs]
        is_live_bench = any(o.stream_session and o.stream_session.is_live for o in tech_jobs)

        return {
            'id': self.id,
            'username': self.username or self.email.split('@')[0],
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'whatsapp': self.whatsapp or self.phone,
            'role': self.role,
            'avatar': self.avatar,
            'address': self.address,
            'city': self.city or 'Hyderabad',
            'landmark': self.landmark,
            'pincode': self.pincode,
            'is_verified': self.is_verified if self.is_verified is not None else True,
            'created_at': self.created_at.isoformat() if self.created_at else None,

            # Technician specific data
            'bench_station': self.bench_station or ('Bench #3 - Cleanroom ISO-5' if self.role == 'technician' else None),
            'specialization': self.specialization or ('Motherboard Chip-Level, BGA Micro-Soldering, Display Rework' if self.role == 'technician' else None),
            'certifications': self.certifications or ('IPC-7711/7721 Certified Rework Specialist, ACMT' if self.role == 'technician' else None),
            'payout_upi': self.payout_upi or (f"tech.{self.username or 'payout'}@okaxis" if self.role == 'technician' else None),
            'experience_years': self.experience_years or (6 if self.role == 'technician' else None),
            'rating': self.rating or (4.9 if self.role == 'technician' else None),
            'is_live_streaming': is_live_bench,
            'tech_assigned_jobs': tech_assigned_count,
            'tech_active_jobs': tech_active_count,
            'tech_completed_jobs': tech_completed_count,
            'tech_total_earnings': tech_net_earnings,
            'tech_assigned_orders': tech_order_numbers,

            # Customer specific data
            'customer_total_orders': cust_total_orders,
            'customer_active_orders': cust_active_orders,
            'customer_completed_orders': cust_completed_orders,
            'customer_total_spend': round(cust_total_spend, 2),
            'customer_orders_list': cust_order_numbers,
            'last_order_date': last_order.created_at.isoformat() if last_order and last_order.created_at else None
        }


class LaptopRepairOrder(db.Model):
    __tablename__ = 'laptop_repair_orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_number = db.Column(db.String(32), unique=True, nullable=False, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    technician_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    laptop_brand = db.Column(db.String(50), nullable=False)
    laptop_model = db.Column(db.String(100), nullable=False)
    serial_number = db.Column(db.String(100), nullable=True)
    issue_category = db.Column(db.String(100), nullable=False)
    issue_description = db.Column(db.Text, nullable=True)

    pickup_address = db.Column(db.Text, nullable=False)
    pickup_area = db.Column(db.String(100), nullable=True)
    pickup_city = db.Column(db.String(50), default='Hyderabad')
    pickup_pincode = db.Column(db.String(20), nullable=True)
    pickup_slot = db.Column(db.String(100), nullable=False)
    tamper_seal_code = db.Column(db.String(50), nullable=True)
    problem_photos = db.Column(db.Text, nullable=True)  # JSON-encoded array of base64 photo proofs
    charger_photos = db.Column(db.Text, nullable=True)  # JSON-encoded array of base64 charger photos
    accessory_photos = db.Column(db.Text, nullable=True)  # JSON-encoded array of base64 accessory photos

    # Essential Hardware & Diagnostic Intake Fields
    device_pin = db.Column(db.String(100), nullable=True)  # Login PIN / Password or None
    power_state = db.Column(db.String(100), default='Turns On & Boots into OS')
    bitlocker_status = db.Column(db.String(100), nullable=True)
    credentials_requested = db.Column(db.Boolean, default=False)
    credentials_request_note = db.Column(db.String(255), nullable=True)
    credentials_provided = db.Column(db.Boolean, default=False)
    charger_included = db.Column(db.Boolean, default=False)
    charger_details = db.Column(db.String(150), nullable=True)
    included_accessories = db.Column(db.Text, nullable=True)  # JSON or comma string
    pre_existing_damage = db.Column(db.Text, nullable=True)  # Scratches, cracks, liquid history
    data_backup_status = db.Column(db.String(100), default='Customer Confirmed Backup (Diagnostic Waiver Signed)')
    chassis_open_consent = db.Column(db.Boolean, default=True)
    part_preference = db.Column(db.String(100), default='OEM Original (100% Genuine with Brand Warranty)')
    whatsapp_number = db.Column(db.String(30), nullable=True)
    pickup_landmark = db.Column(db.String(200), nullable=True)

    # Status milestones:
    # 1. 'Order Placed'
    # 2. 'Picked Up'
    # 3. 'In Repair'
    # 4. 'Repaired & Awaiting Payment'
    # 5. 'Delivered'
    status = db.Column(db.String(40), default='Order Placed', index=True)

    quote_amount = db.Column(db.Float, default=0.0)
    quote_approved = db.Column(db.Boolean, default=False)
    technician_notes = db.Column(db.Text, nullable=True)

    # Price range & transparent negotiation
    base_price_min = db.Column(db.Float, default=1500.0)
    base_price_max = db.Column(db.Float, default=3500.0)
    customer_selected_price = db.Column(db.Float, nullable=True)
    final_agreed_price = db.Column(db.Float, nullable=True)
    price_status = db.Column(db.String(30), default='pending')  # 'pending', 'customer_proposed', 'price_agreed'

    # Transparent Chain-of-Custody milestones:
    pickup_status = db.Column(db.String(30), default='not_requested')
    pickup_scheduled_time = db.Column(db.String(100), nullable=True)

    # Tamper seal & unsealing authorization
    unseal_status = db.Column(db.String(30), default='sealed')

    # Resealing notification & return dispatch
    reseal_status = db.Column(db.String(30), default='not_resealed')
    reseal_tamper_code = db.Column(db.String(50), nullable=True)

    # Final Customer Review & Google Meet Recording Delivery
    final_rating = db.Column(db.Integer, nullable=True)
    final_review = db.Column(db.Text, nullable=True)
    meet_recording_url = db.Column(db.String(255), nullable=True)
    meet_recording_sent_to_email = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    stream_session = db.relationship('StreamSession', backref='order', uselist=False, cascade='all, delete-orphan')
    parts = db.relationship('PartReplacementLog', backref='order', lazy=True, cascade='all, delete-orphan')
    payment = db.relationship('Payment', backref='order', uselist=False, cascade='all, delete-orphan')
    messages = db.relationship('OrderMessage', backref='order', lazy=True, cascade='all, delete-orphan', order_by='OrderMessage.id.asc()')

    def to_dict(self):
        def parse_json_or_list(val):
            if not val:
                return []
            if isinstance(val, list):
                return val
            if isinstance(val, str):
                val_stripped = val.strip()
                if val_stripped.startswith('[') and val_stripped.endswith(']'):
                    try:
                        return json.loads(val_stripped)
                    except Exception:
                        pass
                return [item.strip() for item in val_stripped.split(',') if item.strip()]
            return [str(val)]

        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_id': self.customer_id,
            'customer_name': self.customer.name if self.customer else None,
            'customer_email': self.customer.email if self.customer else None,
            'customer_phone': self.customer.phone if self.customer else None,
            'customer_whatsapp': self.whatsapp_number or (self.customer.whatsapp if self.customer else None) or (self.customer.phone if self.customer else None),
            'technician_id': self.technician_id,
            'technician_name': self.technician.name if self.technician else 'Awaiting Assignment',
            'technician_bench': self.technician.bench_station if self.technician else 'Cleanroom Bench Unassigned',
            'technician_phone': self.technician.phone if self.technician else None,
            'laptop_brand': self.laptop_brand,
            'laptop_model': self.laptop_model,
            'serial_number': self.serial_number,
            'issue_category': self.issue_category,
            'issue_description': self.issue_description,
            'pickup_address': self.pickup_address,
            'pickup_area': self.pickup_area,
            'pickup_city': self.pickup_city,
            'pickup_pincode': self.pickup_pincode,
            'pickup_landmark': self.pickup_landmark,
            'pickup_slot': self.pickup_slot,
            'tamper_seal_code': self.tamper_seal_code,
            'problem_photos': (
                json.loads(self.problem_photos) if (self.problem_photos and isinstance(self.problem_photos, str) and (self.problem_photos.startswith('[') or self.problem_photos.startswith('{')))
                else (self.problem_photos if isinstance(self.problem_photos, list) else ([self.problem_photos] if self.problem_photos else []))
            ),
            'charger_photos': (
                json.loads(self.charger_photos) if (self.charger_photos and isinstance(self.charger_photos, str) and (self.charger_photos.startswith('[') or self.charger_photos.startswith('{')))
                else (self.charger_photos if isinstance(self.charger_photos, list) else ([self.charger_photos] if self.charger_photos else []))
            ),
            'accessory_photos': (
                json.loads(self.accessory_photos) if (self.accessory_photos and isinstance(self.accessory_photos, str) and (self.accessory_photos.startswith('[') or self.accessory_photos.startswith('{')))
                else (self.accessory_photos if isinstance(self.accessory_photos, list) else ([self.accessory_photos] if self.accessory_photos else []))
            ),
            # Hardware intake and security details
            'device_pin': self.device_pin,
            'bitlocker_status': self.bitlocker_status,
            'credentials_requested': bool(self.credentials_requested),
            'credentials_request_note': self.credentials_request_note,
            'credentials_provided': bool(self.credentials_provided or bool(self.device_pin)),
            'power_state': self.power_state or 'Turns On & Boots into OS',
            'charger_included': bool(self.charger_included),
            'charger_details': self.charger_details or ('No Charger Handed Over' if not self.charger_included else 'Original Charger Included'),
            'included_accessories': parse_json_or_list(self.included_accessories),
            'pre_existing_damage': parse_json_or_list(self.pre_existing_damage),
            'data_backup_status': self.data_backup_status or 'Customer Confirmed Backup (Diagnostic Waiver Signed)',
            'chassis_open_consent': bool(self.chassis_open_consent),
            'part_preference': self.part_preference or 'OEM Original (100% Genuine with Brand Warranty)',
            'status': self.status,
            'quote_amount': self.quote_amount,
            'quote_approved': self.quote_approved,
            'base_price_min': self.base_price_min or 1500.0,
            'base_price_max': self.base_price_max or 3500.0,
            'customer_selected_price': self.customer_selected_price,
            'final_agreed_price': self.final_agreed_price,
            'price_status': self.price_status or 'pending',
            'pickup_status': self.pickup_status or 'not_requested',
            'pickup_scheduled_time': self.pickup_scheduled_time,
            'unseal_status': self.unseal_status or 'sealed',
            'reseal_status': self.reseal_status or 'not_resealed',
            'reseal_tamper_code': self.reseal_tamper_code,
            'final_rating': self.final_rating,
            'final_review': self.final_review,
            'meet_recording_url': self.meet_recording_url,
            'meet_recording_sent_to_email': self.meet_recording_sent_to_email or False,
            'technician_notes': self.technician_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'stream_session': self.stream_session.to_dict() if self.stream_session else None,
            'parts': [p.to_dict() for p in self.parts],
            'payment': self.payment.to_dict() if self.payment else None,
            'messages_count': len(self.messages) if self.messages else 0
        }


class StreamSession(db.Model):
    __tablename__ = 'stream_sessions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('laptop_repair_orders.id'), unique=True, nullable=False)
    meet_url = db.Column(db.String(255), nullable=False)
    stream_key = db.Column(db.String(64), nullable=True)
    is_live = db.Column(db.Boolean, default=False)
    started_at = db.Column(db.DateTime, nullable=True)
    ended_at = db.Column(db.DateTime, nullable=True)
    current_milestone = db.Column(db.String(100), default='Unsealing & Initial Inspection')
    camera_source = db.Column(db.String(50), default='Overhead Bench 4K')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'meet_url': self.meet_url,
            'stream_key': self.stream_key,
            'is_live': self.is_live,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'current_milestone': self.current_milestone,
            'camera_source': self.camera_source
        }


class PartReplacementLog(db.Model):
    __tablename__ = 'part_replacement_logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('laptop_repair_orders.id'), nullable=False)
    part_name = db.Column(db.String(120), nullable=False)
    old_serial_no = db.Column(db.String(100), nullable=True)
    new_serial_no = db.Column(db.String(100), nullable=True)
    verified_on_camera = db.Column(db.Boolean, default=True)
    cost = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'part_name': self.part_name,
            'old_serial_no': self.old_serial_no,
            'new_serial_no': self.new_serial_no,
            'verified_on_camera': self.verified_on_camera,
            'cost': self.cost,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('laptop_repair_orders.id'), unique=True, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(40), default='UPI')
    transaction_id = db.Column(db.String(64), unique=True, nullable=False)
    payment_status = db.Column(db.String(30), default='Completed')
    paid_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    warranty_code = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'amount': self.amount,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'payment_status': self.payment_status,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'warranty_code': self.warranty_code
        }


class EmailOTP(db.Model):
    __tablename__ = 'email_otps'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), nullable=False, index=True)
    otp_code = db.Column(db.String(10), nullable=False)
    role = db.Column(db.String(20), default='customer')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)


class OrderMessage(db.Model):
    __tablename__ = 'order_messages'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('laptop_repair_orders.id'), nullable=False, index=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    sender_name = db.Column(db.String(100), nullable=False)
    sender_role = db.Column(db.String(20), nullable=False)  # 'customer', 'technician', 'admin', 'system'
    
    # Message types:
    # 'text' -> standard chat message
    # 'price_proposed' -> customer/technician proposed a final price
    # 'price_agreed' -> agreed price finalized
    # 'pickup_raised' -> technician raised doorstep pickup schedule
    # 'pickup_accepted' -> customer accepted pickup
    # 'collected' -> technician collected device with sealed bag at bench
    # 'unseal_requested' -> technician requested authorization to open seal
    # 'unseal_approved' -> customer approved unseal & launched Google Meet
    # 'live_meet_ready' -> Google Meet session active
    # 'reseal_notified' -> technician notified customer that device is being re-sealed
    # 'dispatched' -> sealed device dispatched back to customer
    # 'final_review' -> customer tested laptop and submitted final review & rating
    # 'recording_delivered' -> Google Meet video recording link delivered to customer email
    message_type = db.Column(db.String(40), default='text', index=True)
    content = db.Column(db.Text, nullable=False)
    metadata_json = db.Column(db.Text, nullable=True)  # JSON-encoded payload
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        import json
        meta = {}
        if self.metadata_json:
            try:
                meta = json.loads(self.metadata_json)
            except Exception:
                meta = {}
        return {
            'id': self.id,
            'order_id': self.order_id,
            'sender_id': self.sender_id,
            'sender_name': self.sender_name,
            'sender_role': self.sender_role,
            'message_type': self.message_type,
            'content': self.content,
            'metadata': meta,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
