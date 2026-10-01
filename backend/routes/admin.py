import random
import datetime
from flask import Blueprint, request, jsonify
from models import db, User, LaptopRepairOrder, StreamSession, PartReplacementLog, Payment
from routes.auth import token_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(f):
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'error': 'Admin privileges required for this action'}), 403
        return f(current_user, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated


@admin_bp.route('/overview', methods=['GET'])
def get_overview():
    total_users = User.query.count()
    customers_count = User.query.filter_by(role='customer').count()
    technicians_count = User.query.filter_by(role='technician').count()
    admins_count = User.query.filter_by(role='admin').count()

    total_orders = LaptopRepairOrder.query.count()
    active_in_flight_statuses = [
        'In Repair', 'Delivered to Bench', 'Quality Check', 
        'Technician Accepted', 'Pickup Scheduled', 'Picked Up'
    ]
    in_repair_count = LaptopRepairOrder.query.filter(
        LaptopRepairOrder.status.in_(active_in_flight_statuses)
    ).count()
    delivered_count = LaptopRepairOrder.query.filter_by(status='Delivered').count()
    placed_count = LaptopRepairOrder.query.filter_by(status='Order Placed').count()

    # Sum total order quotes and active escrow
    orders = LaptopRepairOrder.query.all()
    total_volume = sum([
        float(o.final_agreed_price or o.customer_selected_price or o.quote_amount or 0.0)
        for o in orders
    ])
    escrow_held = sum([
        float(o.final_agreed_price or o.customer_selected_price or o.quote_amount or 0.0)
        for o in orders 
        if o.status not in ['Delivered', 'Cancelled']
    ])

    return jsonify({
        'total_users': total_users,
        'customers_count': customers_count,
        'technicians_count': technicians_count,
        'admins_count': admins_count,
        'total_orders': total_orders,
        'in_repair_count': in_repair_count,
        'delivered_count': delivered_count,
        'placed_count': placed_count,
        'total_volume': round(total_volume, 2),
        'escrow_held': round(escrow_held, 2)
    }), 200


@admin_bp.route('/users', methods=['GET'])
def list_all_users():
    role_filter = request.args.get('role')
    query = User.query
    if role_filter and role_filter != 'all':
        query = query.filter_by(role=role_filter)
    
    users = query.order_by(User.id.asc()).all()
    users_data = []
    for u in users:
        try:
            users_data.append(u.to_dict())
        except Exception as err:
            print(f"[Admin API] Error serializing user {u.id}: {err}")
    return jsonify({
        'users': users_data
    }), 200


@admin_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    username = data.get('username', '').strip().lower()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '123123123')
    role = data.get('role', 'customer')

    if not name or not email:
        return jsonify({'error': 'Name and Email are required'}), 400

    if role not in ['customer', 'technician', 'admin']:
        role = 'customer'

    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({'error': 'A user with this email already exists'}), 409

    if username:
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'A user with this username already exists'}), 409

    user = User(
        name=name,
        username=username or email.split('@')[0],
        email=email,
        phone=phone or '+91 90000 00000',
        whatsapp=data.get('whatsapp') or phone or '+91 90000 00000',
        address=data.get('address'),
        city=data.get('city') or 'Hyderabad',
        landmark=data.get('landmark'),
        pincode=data.get('pincode'),
        bench_station=data.get('bench_station'),
        specialization=data.get('specialization'),
        certifications=data.get('certifications'),
        payout_upi=data.get('payout_upi'),
        role=role
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': f'User {user.name} created successfully',
        'user': user.to_dict()
    }), 201


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json() or {}
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    whatsapp = data.get('whatsapp')
    address = data.get('address')
    city = data.get('city')
    landmark = data.get('landmark')
    pincode = data.get('pincode')
    bench_station = data.get('bench_station')
    specialization = data.get('specialization')
    certifications = data.get('certifications')
    payout_upi = data.get('payout_upi')
    role = data.get('role')
    password = data.get('password')

    if name:
        user.name = name.strip()
    if username:
        clean_user = username.strip().lower()
        if clean_user != user.username:
            check = User.query.filter_by(username=clean_user).first()
            if check and check.id != user.id:
                return jsonify({'error': 'Username already taken'}), 400
            user.username = clean_user
    if email:
        clean_email = email.strip().lower()
        if clean_email != user.email:
            check = User.query.filter_by(email=clean_email).first()
            if check and check.id != user.id:
                return jsonify({'error': 'Email already registered to another user'}), 400
            user.email = clean_email
    if phone:
        user.phone = phone.strip()
    if whatsapp:
        user.whatsapp = whatsapp.strip()
    if address is not None:
        user.address = address.strip()
    if city is not None:
        user.city = city.strip()
    if landmark is not None:
        user.landmark = landmark.strip()
    if pincode is not None:
        user.pincode = pincode.strip()
    if bench_station is not None:
        user.bench_station = bench_station.strip()
    if specialization is not None:
        user.specialization = specialization.strip()
    if certifications is not None:
        user.certifications = certifications.strip()
    if payout_upi is not None:
        user.payout_upi = payout_upi.strip()
    if role and role in ['customer', 'technician', 'admin']:
        user.role = role
    if password:
        user.set_password(password)

    db.session.commit()
    return jsonify({
        'message': f'User {user.name} updated successfully',
        'user': user.to_dict()
    }), 200


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Protect the primary admin
    if user.role == 'admin' and User.query.filter_by(role='admin').count() <= 1:
        return jsonify({'error': 'The primary Admin account cannot be deleted'}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'User {user.name} deleted successfully'}), 200


@admin_bp.route('/orders', methods=['GET'])
def list_all_orders():
    orders = LaptopRepairOrder.query.order_by(LaptopRepairOrder.id.desc()).all()
    orders_data = []
    for o in orders:
        try:
            orders_data.append(o.to_dict())
        except Exception as err:
            print(f"[Admin API] Error serializing order {o.id}: {err}")
    return jsonify({
        'orders': orders_data
    }), 200


@admin_bp.route('/orders/<int:order_id>', methods=['PUT'])
def edit_order(order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Repair order not found'}), 404

    data = request.get_json() or {}
    if 'status' in data:
        order.status = data['status']
    if 'quote_amount' in data:
        order.quote_amount = float(data['quote_amount'])
    if 'quote_approved' in data:
        order.quote_approved = bool(data['quote_approved'])
    if 'final_agreed_price' in data and data['final_agreed_price'] is not None:
        order.final_agreed_price = float(data['final_agreed_price'])
    if 'tamper_seal_code' in data:
        order.tamper_seal_code = data['tamper_seal_code']
    if 'technician_id' in data:
        order.technician_id = int(data['technician_id']) if data['technician_id'] else None
    if 'technician_notes' in data:
        order.technician_notes = data['technician_notes']
    if 'laptop_brand' in data:
        order.laptop_brand = data['laptop_brand']
    if 'laptop_model' in data:
        order.laptop_model = data['laptop_model']
    if 'serial_number' in data:
        order.serial_number = data['serial_number']
    if 'issue_category' in data:
        order.issue_category = data['issue_category']
    if 'issue_description' in data:
        order.issue_description = data['issue_description']
    if 'pickup_address' in data:
        order.pickup_address = data['pickup_address']
    if 'device_pin' in data:
        order.device_pin = data['device_pin']
    if 'power_state' in data:
        order.power_state = data['power_state']
    if 'bitlocker_status' in data:
        order.bitlocker_status = data['bitlocker_status']
    if 'charger_included' in data:
        order.charger_included = bool(data['charger_included'])
    if 'charger_details' in data:
        order.charger_details = data['charger_details']
    if 'part_preference' in data:
        order.part_preference = data['part_preference']

    db.session.commit()
    return jsonify({
        'message': f'Order {order.order_number} updated successfully',
        'order': order.to_dict()
    }), 200


@admin_bp.route('/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Repair order not found'}), 404

    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': f'Order {order.order_number} deleted successfully'}), 200


@admin_bp.route('/reset-database', methods=['POST'])
def reset_database_endpoint():
    from database import seed_clean_admin
    db.drop_all()
    db.create_all()
    seed_clean_admin()
    return jsonify({
        'message': 'Database completely wiped and freshly initialized clean with zero dummy data.',
        'admin_username': 'admin',
        'admin_email': 'admin@livefix.com'
    }), 200
