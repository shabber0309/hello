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
    in_repair_count = LaptopRepairOrder.query.filter_by(status='In Repair').count()
    delivered_count = LaptopRepairOrder.query.filter_by(status='Delivered').count()
    placed_count = LaptopRepairOrder.query.filter_by(status='Order Placed').count()

    # Sum total order quotes
    orders = LaptopRepairOrder.query.all()
    total_volume = sum([o.quote_amount for o in orders if o.quote_amount])
    escrow_held = sum([o.quote_amount for o in orders if o.status in ['In Repair', 'Repaired & Awaiting Payment']])

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
    return jsonify({
        'users': [u.to_dict() for u in users]
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
        phone=phone or '+91 98765 00000',
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
    if user.username == 'shabber' or user.email == 'shabberhussain934@gmail.com':
        return jsonify({'error': 'Protected Admin account cannot be deleted'}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'User {user.name} deleted successfully'}), 200


@admin_bp.route('/orders', methods=['GET'])
def list_all_orders():
    orders = LaptopRepairOrder.query.order_by(LaptopRepairOrder.id.desc()).all()
    return jsonify({
        'orders': [o.to_dict() for o in orders]
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
    if 'issue_category' in data:
        order.issue_category = data['issue_category']
    if 'issue_description' in data:
        order.issue_description = data['issue_description']
    if 'pickup_address' in data:
        order.pickup_address = data['pickup_address']

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
    from database import seed_demo_data
    db.drop_all()
    db.create_all()
    seed_demo_data()
    return jsonify({
        'message': 'Database completely wiped and freshly initialized clean with only Admin Shabber (zero dummy data).',
        'admin_username': 'shabber',
        'admin_email': 'shabberhussain934@gmail.com'
    }), 200
