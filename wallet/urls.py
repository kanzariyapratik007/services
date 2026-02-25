from django.urls import path
from . import views

app_name = "wallet"

urlpatterns = [

    # ===============================
    # USER SIDE APIs
    # ===============================

    # 💰 Get Wallet Balance
    path(
        "balance/",
        views.wallet_balance,
        name="wallet-balance"
    ),

    # 📜 Get User Transactions
    path(
        "transactions/",
        views.transaction_list,
        name="wallet-transactions"
    ),

    # 📤 Submit Manual UPI Payment
    path(
        "submit-manual-payment/",
        views.submit_manual_payment,
        name="submit-manual-payment"
    ),

    # 🔎 Get Single Transaction Detail (future use)
    path(
        "transaction/<str:order_id>/",
        views.transaction_detail,
        name="transaction-detail"
    ),

]