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
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationships
    orders = db.relationship('LaptopRepairOrder', backref='customer', lazy=True, foreign_keys='LaptopRepairOrder.customer_id')
    assigned_repairs = db.relationship('LaptopRepairOrder', backref='technician', lazy=True, foreign_keys='LaptopRepairOrder.technician_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username or self.email.split('@')[0],
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'avatar': self.avatar,
            'created_at': self.created_at.isoformat() if self.created_at else None
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
    # 1. Pickup stage: 'not_requested' -> 'pickup_raised' -> 'pickup_accepted' -> 'collected'
    pickup_status = db.Column(db.String(30), default='not_requested')
    pickup_scheduled_time = db.Column(db.String(100), nullable=True)

    # 2. Tamper seal & unsealing authorization: 'sealed' -> 'unseal_requested' -> 'unseal_approved' -> 'unsealed'
    unseal_status = db.Column(db.String(30), default='sealed')

    # 3. Resealing notification & return dispatch: 'not_resealed' -> 'reseal_notified' -> 'resealed' -> 'dispatched'
    reseal_status = db.Column(db.String(30), default='not_resealed')
    reseal_tamper_code = db.Column(db.String(50), nullable=True)

    # 4. Final Customer Review & Google Meet Recording Delivery
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
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_id': self.customer_id,
            'customer_name': self.customer.name if self.customer else None,
            'customer_email': self.customer.email if self.customer else None,
            'customer_phone': self.customer.phone if self.customer else None,
            'technician_id': self.technician_id,
            'technician_name': self.technician.name if self.technician else 'Awaiting Assignment',
            'laptop_brand': self.laptop_brand,
            'laptop_model': self.laptop_model,
            'serial_number': self.serial_number,
            'issue_category': self.issue_category,
            'issue_description': self.issue_description,
            'pickup_address': self.pickup_address,
            'pickup_area': self.pickup_area,
            'pickup_city': self.pickup_city,
            'pickup_pincode': self.pickup_pincode,
            'pickup_slot': self.pickup_slot,
            'tamper_seal_code': self.tamper_seal_code,
            'problem_photos': json.loads(self.problem_photos) if self.problem_photos else [],
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
