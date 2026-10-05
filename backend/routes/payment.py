import uuid
import datetime
from flask import Blueprint, request, jsonify
from models import db, LaptopRepairOrder, Payment
from routes.auth import token_required

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')

@payment_bp.route('/<int:order_id>/checkout', methods=['POST'])
@token_required
def checkout(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized to pay for this order'}), 403

    data = request.get_json() or {}
    payment_method = data.get('payment_method', 'UPI')
    amount = float(data.get('amount', order.quote_amount or 2500.0))

    existing_payment = Payment.query.filter_by(order_id=order.id).first()
    if existing_payment:
        return jsonify({
            'message': 'Payment already processed for this order',
            'payment': existing_payment.to_dict(),
            'order': order.to_dict()
        }), 200

    txn_id = f"TXN-EOF-{uuid.uuid4().hex[:10].upper()}"
    warranty_code = f"WRTY-6M-{uuid.uuid4().hex[:6].upper()}"

    payment = Payment(
        order_id=order.id,
        amount=amount,
        payment_method=payment_method,
        transaction_id=txn_id,
        payment_status='Completed',
        paid_at=datetime.datetime.utcnow(),
        warranty_code=warranty_code
    )
    db.session.add(payment)

    # Transition order status to Delivered
    order.status = 'Delivered'
    db.session.commit()

    return jsonify({
        'message': 'Payment successful! 6-Month Camera-Verified Warranty issued and return courier dispatched.',
        'payment': payment.to_dict(),
        'order': order.to_dict()
    }), 201


@payment_bp.route('/<int:order_id>/invoice', methods=['GET'])
@token_required
def get_invoice(current_user, order_id):
    order = LaptopRepairOrder.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if current_user.role == 'customer' and order.customer_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    parts_total = sum(p.cost for p in order.parts)
    service_charge = max(order.quote_amount - parts_total, 500.0)

    return jsonify({
        'invoice_number': f"INV-{order.order_number}",
        'order': order.to_dict(),
        'breakdown': {
            'parts_cost': parts_total,
            'technician_lab_fee': service_charge,
            'express_secure_courier': 0.0,  # Free Doorstep Pickup & Delivery
            'total_amount': order.quote_amount
        },
        'warranty': {
            'validity': '6 Months Free Replacement & Labor',
            'code': order.payment.warranty_code if order.payment else None
        }
    }), 200
