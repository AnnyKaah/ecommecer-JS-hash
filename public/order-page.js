document.addEventListener("DOMContentLoaded", async () => {
  const orderSummaryContainer = document.getElementById(
    "order-summary-container"
  );
  const orderForm = document.getElementById("order-form");

  const getAuthToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo ? userInfo.token : null;
  };

  const token = getAuthToken();

  if (!token) {
    window.location.href = "/login.html"; // Redirect to login if not authenticated
    return;
  }

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart.");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      if (orderSummaryContainer) {
        orderSummaryContainer.innerHTML =
          '<p style="color: red;">Could not load your cart.</p>';
      }
      return null;
    }
  };

  const renderOrderSummary = (cart) => {
    if (!cart || !orderSummaryContainer) return;

    if (cart.items.length === 0) {
      orderSummaryContainer.innerHTML =
        '<h3>Your cart is empty</h3><p>Please add items to your cart before checking out.</p><a href="/index.html">Go to Shopping</a>';
      if (orderForm) {
        orderForm.style.display = "none"; // Hide form if cart is empty
      }
      return;
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const summaryHTML = `
            <h3>Order Summary</h3>
            ${cart.items
              .map(
                (item) => `
                <div class="summary-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `
              )
              .join("")}
            <hr>
            <div class="summary-total">
                <strong>Total</strong>
                <strong>$${total.toFixed(2)}</strong>
            </div>
        `;
    orderSummaryContainer.innerHTML = summaryHTML;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const shippingAddress = {
      fullName: formData.get("fullName"),
      address: formData.get("address"),
      city: formData.get("city"),
      zipCode: formData.get("zipCode"),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order.");
      }

      const createdOrder = await response.json();

      // Redirect to a confirmation page
      window.navigateWithTransition(
        `/confirmation.html?orderId=${createdOrder._id}`
      );
    } catch (error) {
      console.error("Order placement error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const cart = await fetchCart();
  renderOrderSummary(cart);
  if (orderForm) {
    orderForm.addEventListener("submit", handleFormSubmit);
  }
});
