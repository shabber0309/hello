import random
import string
from flask import Blueprint, request, jsonify
from models import db, LaptopRepairOrder, PartReplacementLog, StreamSession
from routes.auth import token_required

repair_bp = Blueprint('repair', __name__, url_prefix='/api/repairs')

def generate_order_number():
    random_digits = ''.join(random.choices(string.digits, k=5))
    return f"EOF-2026-{random_digits}"

def generate_seal_code():
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"SEAL-TX-{random_str}"

@repair_bp.route('', methods=['POST'])
@token_required
def create_repair(current_user):
    data = request.get_json() or {}
    laptop_brand = data.get('laptop_brand', '').strip()
    laptop_model = data.get('laptop_model', '').strip()
    serial_number = data.get('serial_number', '').strip()
    issue_category = data.get('issue_category', 'General Diagnostics')
    issue_description = data.get('issue_description', '')
    pickup_address = data.get('pickup_address', '').strip()
    pickup_city = data.get('pickup_city', 'Hyderabad')
    pickup_slot = data.get('pickup_slot', 'Today, 2:00 PM - 4:00 PM')

    if not laptop_brand or not laptop_model or not pickup_address:
        return jsonify({'error': 'Brand, Model, and Pickup Address are required'}), 400

    order_num = generate_order_number()
    seal_code = generate_seal_code()

    # Base estimate based on category
    category_quotes = {
        'Motherboard / No Power': 3200.0,
        'Display / Cracked Glass': 4800.0,
        'Battery Replacement': 2400.0,
        'Liquid Damage Clean & Rework': 3500.0,
        'Hinge & Body Fabrication': 1800.0,
        'SSD & RAM Speed Upgrade': 2900.0,
        'Overheating & Thermal Paste': 1200.0
    }
    initial_quote = category_quotes.get(issue_category, 1500.0)

    order = LaptopRepairOrder(
        order_number=order_num,
        customer_id=current_user.id,
        laptop_brand=laptop_brand,
        laptop_model=laptop_model,
        serial_number=serial_number or f"SN-LP-{random.randint(100000, 999999)}",
        issue_category=issue_category,
        issue_description=issue_description,
        pickup_address=pickup_address,
        pickup_city=pickup_city,
        pickup_slot=pickup_slot,
        tamper_seal_code=seal_code,
        status='Order Placed',
        quote_amount=initial_quote,
        quote_approved=False
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({
        'message': 'Repair booked successfully. Tamper-proof courier pickup scheduled!',
        'order': order.to_dict()
    }), 201


@repair_bp.route('', methods=['GET'])
@token_required
def list_repairs(current_user):
    # If technician or admin, list all orders; if customer, list their own
    if current_user.role in ['technician', 'admin']:
        orders = LaptopRepairOrder.query.order_by(LaptopRepairOrder.id.desc()).all()
    else:
        orders = LaptopRepairOrder.query.filter_by(customer_id=current_user.id).order_by(LaptopRepairOrder.id.desc()).all()

    return jsonify({
        'orders': [o.to_dict() for o in orders]
    }), 200


@repair_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_repair(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Security check: customer can only view their own order
    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized to view this order'}), 403

    return jsonify({'order': order.to_dict()}), 200


@repair_bp.route('/<int:order_id>/status', methods=['PATCH'])
@token_required
def update_status(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can update repair milestone status'}), 403

    data = request.get_json() or {}
    new_status = data.get('status')
    valid_statuses = [
        'Order Placed',
        'Technician Accepted',
        'Pickup Scheduled',
        'Picked Up',
        'Delivered to Bench',
        'In Repair',
        'Quality Check',
        'Repaired & Awaiting Payment',
        'Return Pickup',
        'Delivered'
    ]
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {valid_statuses}'}), 400

    order.status = new_status
    if current_user.role == 'technician' and not order.technician_id:
        order.technician_id = current_user.id

    notes = data.get('technician_notes')
    if notes:
        order.technician_notes = notes

    db.session.commit()

    return jsonify({
        'message': f'Status updated to {new_status}',
        'order': order.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/accept', methods=['POST'])
@token_required
def accept_repair(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can accept repair requests'}), 403

    order.technician_id = current_user.id
    order.status = 'Technician Accepted'
    
    data = request.get_json() or {}
    if 'quote_amount' in data and data['quote_amount']:
        order.quote_amount = float(data['quote_amount'])
    if 'technician_notes' in data and data['technician_notes']:
        order.technician_notes = data['technician_notes']

    db.session.commit()

    return jsonify({
        'message': f'Order {order.order_number} successfully accepted by {current_user.name}!',
        'order': order.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/quote', methods=['POST'])
@token_required
def set_quote(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can set quotes'}), 403

    data = request.get_json() or {}
    quote_amount = float(data.get('quote_amount', 0))
    notes = data.get('technician_notes')

    order.quote_amount = quote_amount
    if notes:
        order.technician_notes = notes

    db.session.commit()
    return jsonify({
        'message': 'Quote submitted for customer approval',
        'order': order.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/approve-quote', methods=['POST'])
@token_required
def approve_quote(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if order.customer_id != current_user.id and current_user.role != 'admin':
        return jsonify({'error': 'Only the owner can approve the quote'}), 403

    data = request.get_json() or {}
    approved = data.get('approved', True)
    order.quote_approved = approved

    db.session.commit()
    return jsonify({
        'message': 'Quote approved' if approved else 'Quote declined',
        'order': order.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/parts', methods=['POST'])
@token_required
def log_part(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can record part replacements'}), 403

    data = request.get_json() or {}
    part_name = data.get('part_name')
    old_serial = data.get('old_serial_no')
    new_serial = data.get('new_serial_no')
    cost = float(data.get('cost', 0))

    if not part_name:
        return jsonify({'error': 'Part name is required'}), 400

    part_log = PartReplacementLog(
        order_id=order.id,
        part_name=part_name,
        old_serial_no=old_serial,
        new_serial_no=new_serial,
        verified_on_camera=True,
        cost=cost
    )
    db.session.add(part_log)
    db.session.commit()

    return jsonify({
        'message': 'Part replacement verified on camera and logged',
        'part': part_log.to_dict(),
        'order': order.to_dict()
    }), 201


@repair_bp.route('/track/<string:query>', methods=['GET'])
def track_repair(query):
    query = query.strip()
    if not query:
        return jsonify({'error': 'Please provide an Order ID, Serial Number, or registered Phone/Email'}), 400

    # 1. Match directly by order number, serial number, or tamper seal code
    order = LaptopRepairOrder.query.filter(
        (LaptopRepairOrder.order_number.ilike(query)) |
        (LaptopRepairOrder.serial_number.ilike(query)) |
        (LaptopRepairOrder.tamper_seal_code.ilike(query))
    ).first()

    # 2. Or match by customer's email or phone number
    if not order:
        from models import User
        matched_user = User.query.filter(
            (User.email.ilike(query)) |
            (User.phone == query)
        ).first()
        if matched_user:
            order = LaptopRepairOrder.query.filter_by(customer_id=matched_user.id).order_by(LaptopRepairOrder.id.desc()).first()

    if not order:
        return jsonify({'error': f'No active repair found matching "{query}"'}), 404

    return jsonify({'order': order.to_dict()}), 200

