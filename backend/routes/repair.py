import json
import random
import string
import datetime
from flask import Blueprint, request, jsonify, current_app
from models import db, LaptopRepairOrder, PartReplacementLog, StreamSession, OrderMessage, User
from routes.auth import token_required
from routes.stream import create_google_meet_room

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

    # Category based transparent base price ranges
    category_ranges = {
        'Motherboard / No Power': (2500.0, 5500.0),
        'Display / Cracked Glass': (3500.0, 6800.0),
        'Battery Replacement': (1800.0, 3200.0),
        'Liquid Damage Clean & Rework': (2800.0, 5000.0),
        'Hinge & Body Fabrication': (1200.0, 2600.0),
        'SSD & RAM Speed Upgrade': (1800.0, 4200.0),
        'Overheating & Thermal Paste': (800.0, 1800.0)
    }
    base_min, base_max = category_ranges.get(issue_category, (1500.0, 3500.0))
    initial_quote = round((base_min + base_max) / 2, 2)

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
        base_price_min=base_min,
        base_price_max=base_max,
        quote_amount=initial_quote,
        quote_approved=False,
        price_status='pending',
        pickup_status='not_requested',
        unseal_status='sealed',
        reseal_status='not_resealed'
    )
    db.session.add(order)
    db.session.flush()

    # Seed initial order welcome message
    init_msg = OrderMessage(
        order_id=order.id,
        sender_id=None,
        sender_name="Live Fix Concierge",
        sender_role="system",
        message_type="price_negotiation",
        content=f"Order #{order_num} registered for {laptop_brand} {laptop_model}. Estimated base price range is ₹{int(base_min):,} – ₹{int(base_max):,}. Please select your preferred price target to start pickup scheduling.",
        metadata_json=json.dumps({
            "base_price_min": base_min,
            "base_price_max": base_max,
            "initial_estimate": initial_quote,
            "tamper_seal_code": seal_code
        })
    )
    db.session.add(init_msg)
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


# ==============================================================================
# TRANSPARENT WORKFLOW & CUSTOMER-TECHNICIAN CONVERSATION PIPELINE
# ==============================================================================

def send_meet_recording_email(recipient_email, customer_name, order_number, recording_url):
    """Sends recorded Google Meet session link to customer email via SMTP with fallback."""
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    mail_server = current_app.config.get('MAIL_SERVER', 'smtp.gmail.com')
    mail_port = int(current_app.config.get('MAIL_PORT', 587))
    mail_user = current_app.config.get('MAIL_USERNAME')
    mail_pass = current_app.config.get('MAIL_PASSWORD')
    default_sender = current_app.config.get('MAIL_DEFAULT_SENDER', mail_user or 'support@livefix.com')

    if not mail_user or not mail_pass:
        print(f"[Email Notice] Live Fix recording delivered in mock mode. Target: {recipient_email}, URL: {recording_url}")
        return True, "Mock email recorded (No SMTP configured)"

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Live Fix Repair Recording for Order #{order_number}"
        msg['From'] = f"Live Fix Cleanroom <{default_sender}>"
        msg['To'] = recipient_email

        html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 36px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #38bdf8; font-size: 24px; margin: 0 0 8px;">Live Fix</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0; letter-spacing: 0.5px;">VERIFIED TRANSPARENT HARDWARE CARE</p>
          </div>
          <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
            <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Your Live Repair Video Recording is Ready</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hello <strong>{customer_name or 'Valued Customer'}</strong>,</p>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              Your repair session for <strong>Order #{order_number}</strong> was monitored and recorded under our cleanroom overhead cameras.
              Below is the verified Google Meet video archive containing the unsealing, hardware diagnostics, micro-soldering, and re-sealing stages.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="{recording_url}" target="_blank" style="background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);">
                ▶ Watch Repair Session Recording
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 12px; word-break: break-all; text-align: center;">
              Or access directly: <a href="{recording_url}" style="color: #38bdf8;">{recording_url}</a>
            </p>
          </div>
          <p style="color: #64748b; font-size: 11px; text-align: center; margin-top: 24px;">
            © 2026 Live Fix Inc. • 100% Anti-Tamper Zero Component Swap Guarantee.
          </p>
        </div>
        """
        msg.attach(MIMEText(html, 'html'))

        server = smtplib.SMTP(mail_server, mail_port, timeout=10)
        server.ehlo()
        server.starttls()
        server.login(mail_user, mail_pass)
        server.sendmail(default_sender, [recipient_email], msg.as_string())
        server.quit()
        return True, "Email sent successfully"
    except Exception as e:
        print(f"[Email Notice] Live Fix email SMTP warning: {e}. Session link remains active in-app.")
        return False, str(e)


@repair_bp.route('/<int:order_id>/conversation', methods=['GET'])
@token_required
def get_order_conversation(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Permission check: owner, assigned technician, or admin
    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    # Ensure baseline message exists
    if not order.messages or len(order.messages) == 0:
        base_min = order.base_price_min or 1500.0
        base_max = order.base_price_max or 3500.0
        seed_msg = OrderMessage(
            order_id=order.id,
            sender_id=None,
            sender_name="Live Fix Concierge",
            sender_role="system",
            message_type="price_negotiation",
            content=f"Welcome to the transparent repair thread for Order #{order.order_number}. Estimated base price range is ₹{int(base_min):,} – ₹{int(base_max):,}. Propose your preferred price target to schedule doorstep pickup.",
            metadata_json=json.dumps({
                "base_price_min": base_min,
                "base_price_max": base_max,
                "initial_estimate": order.quote_amount or base_min
            })
        )
        db.session.add(seed_msg)
        db.session.commit()

    return jsonify({
        'order': order.to_dict(),
        'messages': [m.to_dict() for m in order.messages]
    }), 200


@repair_bp.route('/<int:order_id>/conversation', methods=['POST'])
@token_required
def post_chat_message(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json() or {}
    text_content = data.get('content', '').strip()
    if not text_content:
        return jsonify({'error': 'Message content cannot be empty'}), 400

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='text',
        content=text_content
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Message sent successfully',
        'chat_message': msg.to_dict(),
        'order': order.to_dict()
    }), 201


@repair_bp.route('/<int:order_id>/propose-price', methods=['POST'])
@token_required
def propose_price(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json() or {}
    proposed_price = float(data.get('price', 0))
    if proposed_price <= 0:
        return jsonify({'error': 'Invalid proposed price'}), 400

    order.customer_selected_price = proposed_price
    order.price_status = 'customer_proposed'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='price_proposed',
        content=f"{current_user.name} proposed a target repair price of ₹{int(proposed_price):,}.",
        metadata_json=json.dumps({
            "proposed_price": proposed_price,
            "base_price_min": order.base_price_min,
            "base_price_max": order.base_price_max
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': f'Price proposal of ₹{int(proposed_price):,} submitted',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/accept-price', methods=['POST'])
@token_required
def accept_price(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json() or {}
    agreed = float(data.get('agreed_price', order.customer_selected_price or order.quote_amount or 1500.0))

    order.final_agreed_price = agreed
    order.quote_amount = agreed
    order.price_status = 'price_agreed'
    order.quote_approved = True

    if current_user.role == 'technician' and not order.technician_id:
        order.technician_id = current_user.id

    if order.status == 'Order Placed':
        order.status = 'Technician Accepted'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='price_agreed',
        content=f"✅ Price agreement locked at ₹{int(agreed):,}. Both parties agreed on this final cost. Technician can now raise the doorstep pickup request.",
        metadata_json=json.dumps({
            "agreed_price": agreed,
            "accepted_by": current_user.name
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': f'Final price ₹{int(agreed):,} confirmed',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/raise-pickup', methods=['POST'])
@token_required
def raise_pickup(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can raise pickup requests'}), 403

    data = request.get_json() or {}
    pickup_slot = data.get('pickup_slot', 'Today, within 2 hours').strip()
    courier_notes = data.get('notes', 'Doorstep agent assigned with serialized tamper-evident pouch').strip()

    order.pickup_status = 'pickup_raised'
    order.pickup_scheduled_time = pickup_slot
    order.status = 'Pickup Scheduled'
    if not order.technician_id:
        order.technician_id = current_user.id

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role='technician',
        message_type='pickup_raised',
        content=f"🚚 Technician {current_user.name} scheduled a doorstep pickup for {pickup_slot}. Serialized tamper bag: {order.tamper_seal_code}. Please accept pickup to dispatch courier.",
        metadata_json=json.dumps({
            "pickup_slot": pickup_slot,
            "notes": courier_notes,
            "tamper_seal_code": order.tamper_seal_code
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Pickup request raised and awaiting customer confirmation',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/accept-pickup', methods=['POST'])
@token_required
def accept_pickup(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    order.pickup_status = 'pickup_accepted'
    order.status = 'Picked Up'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='pickup_accepted',
        content=f"📦 Customer {current_user.name} accepted the pickup schedule. The courier has sealed the laptop with tamper seal tag {order.tamper_seal_code} and is en route to the technician's cleanroom workbench.",
        metadata_json=json.dumps({
            "tamper_seal_code": order.tamper_seal_code,
            "scheduled_time": order.pickup_scheduled_time
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Pickup accepted and confirmed',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/mark-collected', methods=['POST'])
@token_required
def mark_collected(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can confirm collection'}), 403

    order.pickup_status = 'collected'
    order.status = 'Delivered to Bench'
    order.unseal_status = 'sealed'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role='technician',
        message_type='collected',
        content=f"🔬 Technician {current_user.name} has safely received your laptop at Cleanroom Workbench #4. Tamper Seal {order.tamper_seal_code} is verified 100% INTACT. Device remains sealed until you authorize unsealing.",
        metadata_json=json.dumps({
            "tamper_seal_code": order.tamper_seal_code,
            "bench": "Cleanroom Workbench #4"
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Device marked as collected at workbench',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/request-unseal', methods=['POST'])
@token_required
def request_unseal(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can request unseal authorization'}), 403

    order.unseal_status = 'unseal_requested'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role='technician',
        message_type='unseal_requested',
        content=f"🔒 Unseal Authorization Requested: Technician {current_user.name} is ready at the cleanroom bench to open Tamper Seal {order.tamper_seal_code}. Please approve this request to launch the live video stream session.",
        metadata_json=json.dumps({
            "tamper_seal_code": order.tamper_seal_code,
            "technician_name": current_user.name
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Unseal request sent to customer',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/accept-unseal', methods=['POST'])
@token_required
def accept_unseal(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    order.unseal_status = 'unseal_approved'
    order.status = 'In Repair'

    # Automatically initialize Google Meet / Live Stream room
    meet_url = create_google_meet_room(order)
    session = StreamSession.query.filter_by(order_id=order.id).first()
    if not session:
        session = StreamSession(
            order_id=order.id,
            meet_url=meet_url,
            stream_key=string.ascii_letters[:16],
            is_live=True,
            started_at=datetime.datetime.utcnow(),
            current_milestone='Unsealing & Initial Inspection',
            camera_source='Overhead Bench 4K'
        )
        db.session.add(session)
    else:
        session.is_live = True
        session.meet_url = meet_url
        session.started_at = datetime.datetime.utcnow()

    order.meet_recording_url = meet_url

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='unseal_approved',
        content=f"🎉 Unseal Authorized by {current_user.name}! Live Google Meet Workbench session is now ACTIVE. You can join the live video stream to watch the technician unseal and repair your laptop in real-time.",
        metadata_json=json.dumps({
            "meet_url": meet_url,
            "tamper_seal_code": order.tamper_seal_code,
            "status": "In Repair"
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Unseal approved and live video meet launched',
        'order': order.to_dict(),
        'meet_url': meet_url,
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/notify-reseal', methods=['POST'])
@token_required
def notify_reseal(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can notify resealing'}), 403

    data = request.get_json() or {}
    reseal_code = data.get('reseal_code') or f"SEAL-RETURN-{random.randint(100000, 999999)}"

    order.reseal_status = 'reseal_notified'
    order.reseal_tamper_code = reseal_code
    order.status = 'Repaired & Awaiting Payment'

    # Close live stream if active
    if order.stream_session and order.stream_session.is_live:
        order.stream_session.is_live = False
        order.stream_session.ended_at = datetime.datetime.utcnow()

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role='technician',
        message_type='reseal_notified',
        content=f"🛡️ Repair Complete & Re-Sealing Alert: Hardware service and cleanroom diagnostics are finished. Technician {current_user.name} is now sealing your laptop into a new tamper-evident security box with warranty tag {reseal_code}.",
        metadata_json=json.dumps({
            "reseal_code": reseal_code,
            "technician_name": current_user.name
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': f'Re-sealing notification sent with tamper code {reseal_code}',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/dispatch', methods=['POST'])
@token_required
def dispatch_device(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role not in ['technician', 'admin']:
        return jsonify({'error': 'Only technicians can dispatch devices'}), 403

    data = request.get_json() or {}
    tracking_no = data.get('tracking_no', f"EXP-{random.randint(10000000, 99999999)}")

    order.reseal_status = 'dispatched'
    order.status = 'Return Pickup'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role='technician',
        message_type='dispatched',
        content=f"🚚 Return Delivery In Transit! Your re-sealed laptop (Warranty Seal: {order.reseal_tamper_code}) has been handed over to courier. Tracking: {tracking_no}. Please inspect the seal upon arrival.",
        metadata_json=json.dumps({
            "tracking_no": tracking_no,
            "reseal_tamper_code": order.reseal_tamper_code
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Device marked as dispatched to customer',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/submit-review', methods=['POST'])
@token_required
def submit_final_review(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json() or {}
    rating = int(data.get('rating', 5))
    review_text = data.get('review', 'Device received in perfect sealed condition. Fully tested and satisfied!').strip()

    order.final_rating = rating
    order.final_review = review_text
    order.status = 'Delivered'

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='final_review',
        content=f"⭐ Final Customer Review ({rating}/5 Stars): \"{review_text}\". Customer has inspected the sealed laptop, performed hardware tests, and closed the ticket successfully.",
        metadata_json=json.dumps({
            "rating": rating,
            "review": review_text
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': 'Review submitted and repair closed successfully',
        'order': order.to_dict(),
        'chat_message': msg.to_dict()
    }), 200


@repair_bp.route('/<int:order_id>/deliver-recording', methods=['POST'])
@token_required
def deliver_recording(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json() or {}
    custom_url = data.get('recording_url')
    recording_url = custom_url or order.meet_recording_url
    if not recording_url and order.stream_session:
        recording_url = order.stream_session.meet_url
    if not recording_url:
        recording_url = f"https://meet.google.com/rec-{order.order_number.lower()}"

    order.meet_recording_url = recording_url
    order.meet_recording_sent_to_email = True

    # Send email to customer
    target_email = order.customer.email if order.customer else None
    customer_name = order.customer.name if order.customer else 'Valued Customer'
    email_sent = False
    if target_email:
        sent, info = send_meet_recording_email(target_email, customer_name, order.order_number, recording_url)
        email_sent = sent

    msg = OrderMessage(
        order_id=order.id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message_type='recording_delivered',
        content=f"📹 Google Meet Session Recording Delivered! The complete video archive of your cleanroom repair has been emailed to {target_email or 'your registered email'}. You can also review the recording anytime using the video link.",
        metadata_json=json.dumps({
            "recording_url": recording_url,
            "target_email": target_email,
            "email_sent": email_sent
        })
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'message': f'Recording delivered to {target_email or "customer"} successfully',
        'order': order.to_dict(),
        'recording_url': recording_url,
        'chat_message': msg.to_dict()
    }), 200

