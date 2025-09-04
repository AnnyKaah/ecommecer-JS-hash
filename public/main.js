document.addEventListener("DOMContentLoaded", async () => {
  // --- STATE ---
  // This will hold the items in our cart, loaded from localStorage.
  let cartState = [];
  // This will be populated from the API.
  let products = {};

  // --- DOM ELEMENTS ---
  const cart = document.querySelector(".cart");
  const overlay = document.querySelector(".overlay");
  const closeCartButton = document.querySelector(".cart__close-button");
  const cartIconWrapper = document.getElementById("cart-icon-wrapper");
  const cartItemCountElement = document.getElementById("cart-item-count");
  const addToCartButton = document.querySelector(".button--primary");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalPriceElement = document.getElementById("cart-total-price");
  const checkoutButton = document.querySelector(".checkout-button");
  const productListContainer = document.querySelector(".products");
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  // Elements specific to the product page
  const productPage = document.querySelector(
    ".product-section[data-product-id]"
  );
  const userNav = document.getElementById("user-nav");

  // --- FUNCTIONS ---

  // Helper to get user's auth token from localStorage
  const getAuthToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo ? userInfo.token : null;
  };

  // Toggles the visibility of the cart
  const openCart = () => {
    cart?.classList.remove("cart--hidden");
    overlay?.classList.remove("overlay--hidden");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };
  const closeCart = () => {
    cart?.classList.add("cart--hidden");
    overlay?.classList.add("overlay--hidden");
    document.body.style.overflow = "auto"; // Restore background scroll
  };

  // Saves the guest cart state to the browser's localStorage.
  const saveGuestCartToLocalStorage = () => {
    // Only save to localStorage if the user is a guest
    if (!getAuthToken()) {
      localStorage.setItem("shoppingCart", JSON.stringify(cartState));
    }
  };

  // Loads the cart state from the server if logged in, or from localStorage if a guest.
  const loadCart = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const serverCart = await response.json();
          // Adapt server cart structure to frontend cartState
          cartState = serverCart.items.map((item) => ({
            id: item.product,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }));
        } else {
          // Handle cases like an expired token
          localStorage.removeItem("userInfo");
          loadGuestCartFromLocalStorage();
        }
      } catch (error) {
        console.error("Failed to fetch server cart:", error);
        loadGuestCartFromLocalStorage(); // Fallback to local storage on network error
      }
    } else {
      loadGuestCartFromLocalStorage();
    }
    renderCart();
  };

  // Loads the guest cart from localStorage.
  const loadGuestCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("shoppingCart");
    if (savedCart) {
      cartState = JSON.parse(savedCart);
    }
  };

  // Updates the total price in the cart's DOM
  const updateCartTotal = () => {
    const total = cartState.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (cartTotalPriceElement) {
      cartTotalPriceElement.textContent = `$ ${total.toFixed(2)}`;
    }
  };

  // Atualiza o contador no ícone do carrinho
  const updateCartIconCount = () => {
    if (!cartItemCountElement) return;

    // Somamos a quantidade de cada item, não apenas o número de itens únicos
    const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);

    cartItemCountElement.textContent = totalItems;

    if (totalItems > 0) {
      cartItemCountElement.classList.remove("cart-item-count--hidden");
    } else {
      cartItemCountElement.classList.add("cart-item-count--hidden");
    }
  };

  // Renders all items from cartState into the DOM
  const renderCart = () => {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = ""; // Clears existing items

    if (cartState.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cartState.forEach((item) => {
        const cartItemHTML = `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-img">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <p class="cart-item__name">${item.name}</p>
            <div class="cart-item-bottom">
              <div class="cart-item-quantity">
                <button class="cart-item__quantity-btn" data-action="decrease" aria-label="Decrease quantity">-</button>
                <p class="cart-item__quantity-text">${item.quantity}</p>
                <button class="cart-item__quantity-btn" data-action="increase" aria-label="Increase quantity">+</button>
              </div>
              <p class="cart-item-price">$ ${(
                item.price * item.quantity
              ).toFixed(2)}</p>
            </div>
          </div>
          <button class="cart-item__delete-icon" data-action="delete" aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `;
        cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
      });
    }

    updateCartTotal();
    updateCartIconCount();
    saveGuestCartToLocalStorage(); // Save the guest cart state every time it's re-rendered.
  };

  // --- NOTIFICATION FUNCTION ---
  const showNotification = (message, type = "success") => {
    if (!notificationContainer) return;

    const toast = document.createElement("div");
    toast.className = `notification-toast notification-toast--${type}`;

    const icon =
      type === "success"
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="notification-toast__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="notification-toast__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

    toast.innerHTML = `${icon}<span>${message}</span>`;

    notificationContainer.appendChild(toast);

    // Trigger the slide-in animation
    setTimeout(() => toast.classList.add("show"), 10);

    // Set a timer to hide and remove the toast
    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000); // Notification stays for 3 seconds
  };

  // Handles adding a product to the cart state
  const handleAddToCart = async () => {
    if (!productPage) return;

    const productId = productPage.dataset.productId; // This is now the MongoDB _id
    const product = products[productId];
    if (!product) return; // Should not happen on a valid product page

    const quantitySelector = document.getElementById("quantity-selector");
    const quantityToAdd = parseInt(quantitySelector.value, 10);

    const token = getAuthToken();

    if (token) {
      // --- LOGGED IN: Use API ---
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: quantityToAdd }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add item to cart");
        }
        const updatedCart = await response.json();
        cartState = updatedCart.items.map((item) => ({
          id: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));
      } catch (error) {
        alert(`Error: ${error.message}`);
        return; // Stop execution on error
      }
    } else {
      // --- GUEST: Use localStorage ---
      const existingItem = cartState.find((item) => item.id === productId);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (currentQuantityInCart + quantityToAdd > product.stock) {
        alert(
          `Sorry, you cannot add more than the available stock of ${product.stock} units.`
        );
        return;
      }

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        cartState.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: quantityToAdd,
        });
      }
    }

    showNotification("Item added to cart!");

    // Animate cart icon
    if (cartIconWrapper) {
      cartIconWrapper.classList.add("shake");
      cartIconWrapper.addEventListener(
        "animationend",
        () => cartIconWrapper.classList.remove("shake"),
        { once: true }
      );
    }

    renderCart();
  };

  // Helper to update the cart on the server and re-render
  const updateServerCart = async (updatedCart) => {
    cartState = updatedCart.items.map((item) => ({
      id: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));
    renderCart();
  };

  // Handles clicks within the cart (increase, decrease, delete)
  const handleCartActions = async (event) => {
    const target = event.target;
    const action =
      target.dataset.action || target.closest("[data-action]")?.dataset.action;
    if (!action) return;

    const cartItemElement = target.closest(".cart-item");
    if (!cartItemElement) return;

    const id = cartItemElement.dataset.id;
    const itemIndex = cartState.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    const token = getAuthToken();

    if (token) {
      // --- LOGGED IN: Use API ---
      const currentItem = cartState[itemIndex];
      let method = "PUT";
      let body = {};
      let endpoint = `/api/cart/${id}`;

      if (action === "increase") {
        body = { quantity: currentItem.quantity + 1 };
      } else if (action === "decrease") {
        body = { quantity: currentItem.quantity - 1 };
      } else if (action === "delete") {
        method = "DELETE";
      }

      if (method !== "DELETE" && body.quantity <= 0) {
        method = "DELETE";
      }

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...(method !== "DELETE" && { body: JSON.stringify(body) }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update cart");
        }
        const updatedCart = await response.json();
        updateServerCart(updatedCart);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    } else {
      // --- GUEST: Use localStorage ---
      const product = products[id];
      if (!product) return;
      const stock = product.stock;

      switch (action) {
        case "increase":
          if (cartState[itemIndex].quantity < stock) {
            cartState[itemIndex].quantity++;
          } else {
            alert(
              `You have reached the maximum available stock for this item.`
            );
          }
          break;
        case "decrease":
          cartState[itemIndex].quantity--;
          if (cartState[itemIndex].quantity <= 0) {
            cartState.splice(itemIndex, 1);
          }
          break;
        case "delete":
          cartState.splice(itemIndex, 1);
          break;
      }
      renderCart();
    }
  };

  // Handles placing the order and sending data to the backend
  const handlePlaceOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      alert("Please log in to place an order.");
      const redirectUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.navigateWithTransition(`/login.html?redirect=${redirectUrl}`);
      return;
    }

    // If logged in, the cart is on the server. Just go to the order page.
    window.location.href = "/order.html";
  };

  // Handles the selection of an image in the product gallery
  const handleImageSelection = (event) => {
    const clickedElement = event.target;
    const smallImageWrapper = clickedElement.closest(".small-image");

    if (!smallImageWrapper) {
      return;
    }

    const smallImage = smallImageWrapper.querySelector("img");
    if (!smallImage) return;

    const largeImage = document.getElementById("product-image");
    if (largeImage) {
      largeImage.src = smallImage.src;
    }

    const currentlySelected = document.querySelector(".selected-small-image");
    currentlySelected?.classList.remove("selected-small-image");
    smallImageWrapper.classList.add("selected-small-image");
  };

  // --- EVENT LISTENERS ---
  cartIconWrapper?.addEventListener("click", openCart);
  closeCartButton?.addEventListener("click", closeCart);
  addToCartButton?.addEventListener("click", handleAddToCart);
  overlay?.addEventListener("click", closeCart); // Close cart when clicking outside
  cartItemsContainer?.addEventListener("click", handleCartActions);
  checkoutButton?.addEventListener("click", handlePlaceOrder);
  document
    .querySelector(".small-images")
    ?.addEventListener("click", handleImageSelection);

  // --- AUTH-RELATED UI ---
  const setupUserNav = () => {
    if (!userNav) return;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo && userInfo.token) {
      userNav.innerHTML = `
        <span>Hello, ${userInfo.name}</span>
        <a href="/my-orders.html" class="header-nav-link header-nav-button--secondary">My Orders</a>
        <button id="logout-btn" class="header-nav-link header-nav-button--logout">Logout</button>
      `;

      document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("shoppingCart"); // Clear guest cart on logout
        // In a real SPA, you'd update the state. For now, reload is simplest.
        window.navigateWithTransition("/index.html");
      });
    } else {
      userNav.innerHTML = `
        <a href="/login.html?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}" class="header-nav-link header-nav-button">Login</a>
      `;
    }
  };

  // --- PAGE TRANSITIONS ---
  window.navigateWithTransition = (url) => {
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = url;
    }, 300); // Should match the transition duration in CSS
  };

  // Global click handler for navigation links
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    // Check if it's a valid, internal link that doesn't open in a new tab
    if (
      link &&
      link.href &&
      link.target !== "_blank" &&
      !event.ctrlKey &&
      !event.metaKey &&
      link.href.startsWith(window.location.origin) &&
      !link.href.includes("#") // Ignore anchor links
    ) {
      event.preventDefault();
      window.navigateWithTransition(link.href);
    }
  });

  // --- PAGE-SPECIFIC INITIALIZATION ---
  const renderProductList = (productsToRender) => {
    if (!productListContainer) return;

    productListContainer.innerHTML = ""; // Clear any existing content

    if (productsToRender.length === 0) {
      productListContainer.innerHTML =
        '<p style="grid-column: 1 / -1; text-align: center;">No products are available at the moment.</p>';
      return;
    }

    productsToRender.forEach((product) => {
      const discount = Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );

      const productCardHTML = `
        <a href="product.html?id=${product._id}" class="product">
          <img
            src="${product.images[0]}"
            alt="${product.name}"
            class="product__img"
          />
          <p>${product.name}</p>
          <div class="product__prices">
            <p class="product__price--strikethrough">$ ${product.oldPrice.toFixed(
              2
            )}</p>
            <div class="product__discount">
              <p class="product__price">$ ${product.price.toFixed(2)}</p>
              <p class="green">${discount}% OFF</p>
            </div>
            <p>in <span class="green">${product.installments}</span></p>
          </div>
          <div class="product__shipping--full green">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="product__icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
            <p class="bold">FULL</p>
          </div>
        </a>
      `;
      productListContainer.insertAdjacentHTML("beforeend", productCardHTML);
    });
  };

  const renderProductDetails = (product) => {
    // Set product ID on the main section
    productPage.dataset.productId = product._id;

    // Update text content
    document.getElementById("product-title").textContent = product.name;
    document.getElementById(
      "product-old-price"
    ).textContent = `$ ${product.oldPrice.toFixed(2)}`;
    const priceElement = document.getElementById("product-price");
    priceElement.textContent = `$ ${product.price.toFixed(2)}`;
    priceElement.dataset.price = product.price;
    document.getElementById("product-installments").textContent =
      product.installments;

    // Calculate and display discount
    const discount = Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100
    );
    document.getElementById(
      "product-discount"
    ).textContent = `${discount} % OFF`;

    // Update stock
    document.getElementById(
      "product-stock"
    ).textContent = `(${product.stock} available)`;

    // Dynamically populate quantity selector based on stock
    const quantitySelector = document.getElementById("quantity-selector");
    if (quantitySelector) {
      quantitySelector.innerHTML = ""; // Clear existing options
      // Let's cap the dropdown at 10 for UI reasons, or less if stock is lower.
      const maxQuantity = Math.min(product.stock, 10);

      if (maxQuantity > 0) {
        for (let i = 1; i <= maxQuantity; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = `${i} unit${i > 1 ? "s" : ""}`;
          quantitySelector.appendChild(option);
        }
      } else {
        quantitySelector.innerHTML = '<option value="0">Out of stock</option>';
        quantitySelector.disabled = true;
        addToCartButton.disabled = true;
        addToCartButton.textContent = "Out of stock";
      }
    }

    // Update images
    document.getElementById("product-image").src = product.images[0];
    const smallImagesContainer = document.querySelector(".small-images");
    if (smallImagesContainer) {
      smallImagesContainer.innerHTML = product.images
        .map(
          (imgSrc, index) => `
      <div class="small-image ${index === 0 ? "selected-small-image" : ""}">
        <img src="${imgSrc}" alt="Small Product Image" />
      </div>
    `
        )
        .join("");
    }

    // Update description list
    const descriptionList = document.getElementById("product-description-list");
    if (descriptionList) {
      descriptionList.innerHTML = product.description
        .map((item) => `<li>${item.key}: ${item.value}</li>`)
        .join("");
    }
  };

  const initializeProductPage = () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId && products[productId]) {
      // products object is now keyed by _id
      renderProductDetails(products[productId]);
    } else {
      // Handle product not found
      const productContainer = document.querySelector(".container--product");
      if (productContainer) {
        productContainer.innerHTML = `
          <h1>Product not found</h1>
          <p>The product you are looking for does not exist. Please return to the <a href='/index.html'>homepage</a>.</p>
        `;
      }
    }
  };

  const fetchAndOrganizeProducts = async () => {
    if (productListContainer) {
      productListContainer.innerHTML =
        '<p style="grid-column: 1 / -1; text-align: center;">Loading products...</p>';
    }
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productsArray = await response.json();

      // Convert array to an object keyed by product _id for easy lookup
      products = productsArray.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {});
    } catch (error) {
      console.error("Could not fetch products:", error);
      if (productListContainer) {
        productListContainer.innerHTML =
          '<p style="grid-column: 1 / -1; text-align: center; color: red;">Error loading products. Please try again later.</p>';
      }
    }
  };

  const initializePage = async () => {
    setupUserNav(); // Setup user navigation links
    await fetchAndOrganizeProducts(); // Fetch products from the API first

    await loadCart(); // Load cart from server or localStorage

    if (productPage) {
      initializeProductPage();
    }
    if (productListContainer) {
      renderProductList(Object.values(products)); // Render products after they are fetched
    }
  };

  // --- RUN ---
  await initializePage();
});
