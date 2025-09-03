document.addEventListener("DOMContentLoaded", () => {
  let cartState = [];

  const cart = document.querySelector(".cart");
  const cartIcon = document.getElementById("svg-icone");
  const closeCartButton = document.querySelector(".cart__close-button");
  const addToCartButton = document.querySelector(".button--primary");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalPriceElement = document.getElementById("cart-total-price");

  const productPage = document.querySelector(
    ".product-section[data-product-id]"
  );
  const quantitySelector = document.getElementById("quantity-selector");
  const smallImagesContainer = document.querySelector(".small-images");
  const largeImage = document.getElementById("product-image");

  const openCart = () => {
    if (cart) cart.classList.remove("cart--hidden");
  };
  const closeCart = () => {
    if (cart) cart.classList.add("cart--hidden");
  };

  const updateCartTotal = () => {
    const total = cartState.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (cartTotalPriceElement) {
      cartTotalPriceElement.textContent = `$ ${total.toFixed(2)}`;
    }
  };

  const renderCart = () => {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = ""; // Limpa os itens existentes

    if (cartState.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      updateCartTotal();
      return;
    }

    cartState.forEach((item) => {
      const cartItemHTML = `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-img">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <div class="cart-item-info">
              <p>${item.name}</p>
            </div>
            <div class="cart-item-bottom">
              <div class="cart-item-icon">
                <button class="cart-item__quantity-btn" data-action="decrease">-</button>
                <p>${item.quantity}</p>
                <button class="cart-item__quantity-btn" data-action="increase">+</button>
              </div>
              <p class="cart-item-price">$ ${(
                item.price * item.quantity
              ).toFixed(2)}</p>
              <button class="cart-item__delete-icon" data-action="delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M9 6v12m6-12v12M4 6l1 16h14l1-16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
    });

    updateCartTotal();
  };

  const handleAddToCart = () => {
    if (!productPage) return;

    const id = productPage.dataset.productId;
    const name = document.getElementById("product-title").textContent.trim();
    const priceElement = document.getElementById("product-price");
    const price = parseFloat(priceElement.dataset.price);
    const image = document.getElementById("product-image").src;
    const quantity = parseInt(quantitySelector.value, 10);

    const existingItem = cartState.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartState.push({ id, name, price, image, quantity });
    }

    renderCart();
    openCart();
  };

  const handleCartActions = (event) => {
    const target = event.target;
    const action =
      target.dataset.action || target.closest("[data-action]")?.dataset.action;
    if (!action) return;

    const cartItemElement = target.closest(".cart-item");
    if (!cartItemElement) return;

    const id = cartItemElement.dataset.id;
    const itemIndex = cartState.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    switch (action) {
      case "increase":
        cartState[itemIndex].quantity++;
        break;
      case "decrease":
        cartState[itemIndex].quantity--;
        if (cartState[itemIndex].quantity <= 0) {
          cartState.splice(itemIndex, 1); // Remove se a quantidade for 0 ou menos
        }
        break;
      case "delete":
        cartState.splice(itemIndex, 1); // Remove do array
        break;
    }

    renderCart();
  };

  const handleImageSelection = (event) => {
    const clickedElement = event.target;

    const smallImageWrapper = clickedElement.closest(".small-image");

    if (!smallImageWrapper) {
      return;
    }

    const smallImage = smallImageWrapper.querySelector("img");
    if (!smallImage) {
      return;
    }

    if (largeImage) {
      largeImage.src = smallImage.src;
    }

    const currentlySelected = document.querySelector(".selected-small-image");
    if (currentlySelected) {
      currentlySelected.classList.remove("selected-small-image");
    }
    smallImageWrapper.classList.add("selected-small-image");
  };

  // --- EVENT LISTENERS ---
  if (cartIcon) {
    cartIcon.addEventListener("click", openCart);
  }

  if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
  }

  if (addToCartButton) {
    addToCartButton.addEventListener("click", handleAddToCart);
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", handleCartActions);
  }

  if (smallImagesContainer) {
    smallImagesContainer.addEventListener("click", handleImageSelection);
  }

  renderCart();
});
