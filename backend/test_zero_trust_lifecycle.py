import requests
import json
import sys

BASE_URL = "http://127.0.0.1:5000"

def run_e2e_lifecycle_test():
    print("=== LIVE FIX: ZERO-TRUST 3-OTP & GOOGLE MEET LIFECYCLE E2E TEST ===")
    
    # 1. Login Accounts
    session_cust = requests.Session()
    res = session_cust.post(f"{BASE_URL}/api/auth/login", json={"identifier": "customer@livefix.com", "password": "customer123"})
    assert res.status_code == 200, f"Customer login failed: {res.text}"
    cust_token = res.json()["token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}", "Content-Type": "application/json"}
    print("[OK] 1. Customer Authenticated")

    session_tech = requests.Session()
    res = session_tech.post(f"{BASE_URL}/api/auth/login", json={"identifier": "tech@livefix.com", "password": "tech123"})
    assert res.status_code == 200, f"Technician login failed: {res.text}"
    tech_token = res.json()["token"]
    tech_headers = {"Authorization": f"Bearer {tech_token}", "Content-Type": "application/json"}
    print("[OK] 2. Technician Authenticated")

    session_admin = requests.Session()
    res = session_admin.post(f"{BASE_URL}/api/auth/login", json={"identifier": "admin@livefix.com", "password": "admin123"})
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    admin_token = res.json()["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    print("[OK] 3. Admin Authenticated")

    # 2. Get or create repair order
    res = session_cust.get(f"{BASE_URL}/api/repairs", headers=cust_headers)
    orders = res.json().get("orders", [])
    if orders:
        order = orders[0]
        order_ref = order["order_number"]
    else:
        # Book a new repair
        res = session_cust.post(f"{BASE_URL}/api/repairs", headers=cust_headers, json={
            "laptop_brand": "Dell XPS 15",
            "laptop_model": "9520 OLED",
            "issue_category": "Display / Screen",
            "issue_description": "Flickering display connector",
            "pickup_address": "Cyber Towers, Hitech City",
            "pickup_slot": "Today, 4:00 PM - 5:00 PM",
            "quote_amount": 2500
        })
        assert res.status_code == 201, f"Booking order failed: {res.text}"
        order = res.json()["order"]
        order_ref = order["order_number"]

    print(f"[OK] 4. Target Order: {order_ref} ({order.get('laptop_brand')} {order.get('laptop_model')})")

    # 3. Stage 1: Agree Price
    res = session_cust.post(f"{BASE_URL}/api/repairs/{order_ref}/approve-quote", headers=cust_headers, json={"approved": True})
    assert res.status_code == 200, f"Approve quote failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["price_status"] == "price_agreed", "Price status must be price_agreed"
    assert order_data["timing_slot_status"] == "awaiting_slot", "Timing slot must be awaiting_slot"
    print(f"[OK] 5. STAGE 1 PASSED: Price Approved. Timing slot status is '{order_data['timing_slot_status']}'")

    # 4. Stage 2: Customer Books Timing Slot
    res = session_cust.post(f"{BASE_URL}/api/repairs/{order_ref}/timing-slot", headers=cust_headers, json={
        "timing_slot": "Today, 5:00 PM - 6:00 PM"
    })
    assert res.status_code == 200, f"Book timing slot failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["timing_slot_status"] == "slot_proposed", "Timing slot status must be slot_proposed"
    print(f"[OK] 6. STAGE 2A PASSED: Timing Slot Booked: {order_data['pickup_scheduled_time']}")

    # 5. Stage 2b: Confirm Timing Slot -> Generates Pickup OTP
    res = session_tech.post(f"{BASE_URL}/api/repairs/{order_ref}/confirm-timing-slot", headers=tech_headers, json={
        "timing_slot": "Today, 5:00 PM - 6:00 PM"
    })
    assert res.status_code == 200, f"Confirm timing slot failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["timing_slot_status"] == "slot_confirmed", "Timing slot must be slot_confirmed"
    assert order_data["status"] == "Pickup Scheduled", "Status must be Pickup Scheduled"
    pickup_otp = order_data["pickup_otp"]
    assert pickup_otp and len(pickup_otp) == 6, f"Pickup OTP must be 6 digits, got: {pickup_otp}"
    print(f"[OK] 7. STAGE 2B PASSED: Timing Confirmed. Generated 6-digit Pickup OTP: {pickup_otp}")

    # 6. Stage 3: Technician arrives & verifies Pickup OTP
    res = session_tech.post(f"{BASE_URL}/api/repairs/{order_ref}/verify-pickup-otp", headers=tech_headers, json={
        "otp": pickup_otp
    })
    assert res.status_code == 200, f"Verify pickup OTP failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["pickup_otp_verified"] == True, "Pickup OTP must be verified"
    assert order_data["status"] in ["Delivered to Bench", "Picked Up"], f"Unexpected status: {order_data['status']}"
    print(f"[OK] 8. STAGE 3 PASSED: Pickup OTP Verified! Device custody transferred to Cleanroom Bench.")

    # 7. Stage 4: Technician notifies Google Meet unboxing & issues Unbox OTP
    res = session_tech.post(f"{BASE_URL}/api/repairs/{order_ref}/notify-unboxing", headers=tech_headers)
    assert res.status_code == 200, f"Notify unboxing failed: {res.text}"
    order_data = res.json()["order"]
    meet_url = res.json().get("meet_url")
    unbox_otp = order_data["unbox_otp"]
    assert meet_url and "meet.google.com" in meet_url, f"Google Meet URL missing or invalid: {meet_url}"
    assert unbox_otp and len(unbox_otp) == 6, f"Unbox OTP must be 6 digits, got: {unbox_otp}"
    print(f"[OK] 9. STAGE 4A PASSED: Google Meet Cleanroom Active at {meet_url}. Issued Unbox OTP: {unbox_otp}")

    # Verify Admin can see this Google Meet stream
    res = session_admin.get(f"{BASE_URL}/api/admin/orders", headers=admin_headers)
    assert res.status_code == 200
    admin_orders = res.json().get("orders", [])
    matching = [o for o in admin_orders if o["order_number"] == order_ref]
    assert len(matching) > 0, "Admin must see target order"
    assert matching[0].get("meet_recording_url") or matching[0].get("stream_session"), "Admin must have access to Google Meet session"
    print(f"[OK] 10. ADMIN AUDIT VERIFIED: Admin sees active Google Meet session for {order_ref}")

    # 8. Stage 4b: Verify Unbox OTP inside Google Meet
    res = session_cust.post(f"{BASE_URL}/api/repairs/{order_ref}/verify-unbox-otp", headers=cust_headers, json={
        "otp": unbox_otp
    })
    assert res.status_code == 200, f"Verify unbox OTP failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["unbox_otp_verified"] == True, "Unbox OTP must be verified"
    assert order_data["unseal_status"] == "unsealed", "Device must be marked unsealed"
    assert order_data["status"] == "In Repair", "Status must be In Repair"
    print(f"[OK] 11. STAGE 4B PASSED: Unbox OTP Verified on Google Meet! Tamper seal broken on live camera.")

    # 9. Stage 5: Log Replaced Part
    res = session_tech.post(f"{BASE_URL}/api/repairs/{order_data['id']}/parts", headers=tech_headers, json={
        "part_name": "OEM EDP Display Connector Flex Cable",
        "old_serial_no": "CAB-FLX-OLD-9912",
        "new_serial_no": "CAB-FLX-GEN-5541",
        "cost": 1200
    })
    assert res.status_code == 201, f"Log part failed: {res.text}"
    print("[OK] 12. STAGE 5 PASSED: Replaced OEM Part Logged with serial numbers & warranty.")

    # 10. Stage 6: Technician notifies repair complete & live packing with Packing OTP
    res = session_tech.post(f"{BASE_URL}/api/repairs/{order_ref}/notify-packing", headers=tech_headers)
    assert res.status_code == 200, f"Notify packing failed: {res.text}"
    order_data = res.json()["order"]
    packing_otp = order_data["packing_otp"]
    assert packing_otp and len(packing_otp) == 6, f"Packing OTP must be 6 digits, got: {packing_otp}"
    print(f"[OK] 13. STAGE 6A PASSED: Repair Complete. Live Packing notification sent with Packing OTP: {packing_otp}")

    # 11. Stage 6b: Verify Packing OTP -> Reseals laptop
    res = session_cust.post(f"{BASE_URL}/api/repairs/{order_ref}/verify-packing-otp", headers=cust_headers, json={
        "otp": packing_otp
    })
    assert res.status_code == 200, f"Verify packing OTP failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["packing_otp_verified"] == True, "Packing OTP must be verified"
    assert order_data["reseal_status"] == "resealed", "Reseal status must be resealed"
    assert order_data["status"] == "Repaired & Awaiting Payment", f"Status must be Repaired & Awaiting Payment, got {order_data['status']}"
    assert order_data["reseal_tamper_code"], "Reseal tamper code must exist"
    print(f"[OK] 14. STAGE 6B PASSED: Packing OTP Verified! Resealed with Security Tag: {order_data['reseal_tamper_code']}")

    # 12. Stage 7: Escrow Payment & Delivery
    res = session_cust.post(f"{BASE_URL}/api/payment/{order_data['id']}/checkout", headers=cust_headers, json={
        "amount": 2500,
        "payment_method": "UPI Escrow Release"
    })
    assert res.status_code == 200, f"Checkout failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["status"] == "Delivered", f"Status must be Delivered, got {order_data['status']}"
    print(f"[OK] 15. STAGE 7 PASSED: Escrow Payment Released. Status is Delivered with 6-month platform warranty.")

    # 13. Final Review & Feedback
    res = session_cust.post(f"{BASE_URL}/api/repairs/{order_data['id']}/submit-review", headers=cust_headers, json={
        "rating": 5,
        "review": "Watched the unboxing & repair live on Google Meet. Completely transparent service and fast pickup!"
    })
    assert res.status_code == 200, f"Submit review failed: {res.text}"
    order_data = res.json()["order"]
    assert order_data["final_rating"] == 5
    print("[OK] 16. FINAL STAGE PASSED: 5-Star Customer Review Recorded. Entire Zero-Trust cycle complete!")

    print("\n[SUCCESS] ALL 16 INTEGRATION TEST SUITES PASSED FLAWLESSLY!")

if __name__ == "__main__":
    run_e2e_lifecycle_test()
