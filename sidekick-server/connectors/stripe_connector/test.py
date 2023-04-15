import stripe

# Replace this with your Stripe API key
stripe.api_key = "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"

# Get charges
charges = stripe.Charge.list(limit=100)  # Limit can be 1 to 100, 10 is default
charge_list = charges.get("data")


# Get refunds
refunds = stripe.Refund.list(limit=100)
refund_list = refunds.get("data")

print(refund_list[0])


# Get transfers
transfers = stripe.Transfer.list(limit=100)
transfer_list = transfers.get("data")



# Combine all transaction history
all_transactions = charge_list + payment_list + refund_list + transfer_list

# Sort transactions by created timestamp (newest first)
sorted_transactions = sorted(all_transactions, key=lambda x: x["created"], reverse=True)

# Print transactions
# for transaction in sorted_transactions:
#     t_str = str(transaction)
#     print(t_str)
    # print(f"ID: {transaction['id']} Type: {transaction['object']} Created: {transaction['created']}")

