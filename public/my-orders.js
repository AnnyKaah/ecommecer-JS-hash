document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders-container");

  const renderOrders = (orders) => {
    if (!ordersContainer) return;

    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = "<p>You haven't placed any orders yet.</p>";
      return;
    }

    const ordersHTML = orders
      .map(
        (order) => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
            <p class="order-status order-status--${order.status.toLowerCase()}">
              Status: ${order.status}
            </p>
          </div>
        </div>
        <div class="order-body">
          <h4>Items</h4>
          ${order.orderItems
            .map(
              (item) => `
            <div class="order-item">
              <img src="${item.image}" alt="${
                item.name
              }" class="order-item-image" />
              <div class="order-item-details">
                <p>${item.name}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="order-footer">
            <h4>Shipping Address</h4>
            <p>${order.shippingAddress.fullName}</p>
            <p>${order.shippingAddress.address}, ${
          order.shippingAddress.city
        }</p>
            <p>${order.shippingAddress.zipCode}</p>
        </div>
        ${
          order.status === "Processing"
            ? `<div class="order-actions">
                 <button class="cancel-order-btn" data-order-id="${order._id}">Cancel Order</button>
               </div>`
            : ""
        }
      </div>
    `
      )
      .join("");

    ordersContainer.innerHTML = ordersHTML;
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) return;

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel order.");
      }

      // Refresh the orders list to show the updated status
      await fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(`Could not cancel order: ${error.message}`);
    }
  };

  ordersContainer?.addEventListener("click", (e) => {
    if (e.target.matches(".cancel-order-btn")) {
      const orderId = e.target.dataset.orderId;
      handleCancelOrder(orderId);
    }
  });

  const fetchOrders = async () => {
    // Assume the token is stored in localStorage after login
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.token) {
      ordersContainer.innerHTML =
        '<p>You must be <a href="/login.html?redirect=/my-orders.html">logged in</a> to view your orders.</p>';
      return;
    }

    try {
      ordersContainer.innerHTML = "<p>Loading your orders...</p>";
      const response = await fetch("/api/orders/myorders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const orders = await response.json();
      renderOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      ordersContainer.innerHTML =
        '<p style="color: red;">Could not load your orders. Please try again later.</p>';
    }
  };

  fetchOrders();
});
