document.addEventListener('DOMContentLoaded', () => {
    let cart = [];

    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const totalPriceSpan = document.getElementById('total-price');

    // Attach Event Listeners
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', orderViaContactForm);

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    // Event Delegation for Cart Actions (Increase/Decrease Quantity, Remove)
    if (cartItemsDiv) {
        cartItemsDiv.addEventListener('click', (e) => {
            const target = e.target;
            const indexStr = target.getAttribute('data-index');

            // Allow clicking on child elements like an icon if added later
            const itemIndex = indexStr !== null ? parseInt(indexStr) : parseInt(target.closest('button')?.getAttribute('data-index'));

            if (isNaN(itemIndex)) return;

            if (target.classList.contains('qty-btn') || target.closest('.qty-btn')) {
                const changeStr = target.getAttribute('data-change') || target.closest('.qty-btn').getAttribute('data-change');
                const change = parseInt(changeStr);
                updateQuantity(itemIndex, change);
            } else if (target.classList.contains('remove-btn') || target.closest('.remove-btn')) {
                removeItem(itemIndex);
            }
        });
    }

    // Core Functions
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    function addToCart(productName, price) {
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: productName, price: price, quantity: 1 });
        }

        updateCartUI();

        // Open cart to show user that the item was added
        if (!cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }

    function updateQuantity(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    function removeItem(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            updateCartUI();
        }
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCountSpan.innerText = totalItems;
        totalPriceSpan.innerText = totalPrice;

        cartItemsDiv.innerHTML = '';

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart-msg">Your shopping cart is currently empty</p>';
            return;
        }

        cart.forEach((item, index) => {
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <span class="cart-item-title">${item.name}</span>
                        <span class="cart-item-price">${item.price * item.quantity} EGP</span>
                    </div>
                    <div class="cart-item-controls">
                        <div class="qty-controls">
                            <button class="qty-btn" data-index="${index}" data-change="-1">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn" data-index="${index}" data-change="1">+</button>
                        </div>
                        <button class="remove-btn" data-index="${index}">
                            🗑️ Remove
                        </button>
                    </div>
                </div>
            `;
        });
    }

    function orderViaContactForm() {
        if (cart.length === 0) {
            alert("Your cart is empty. Add items first.");
            return;
        }

        let message = "Order Details:\n";
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (Quantity: ${item.quantity}) - ${item.price * item.quantity} EGP\n`;
        });
        message += `\nTotal: ${totalPrice} EGP`;

        const contactItemField = document.getElementById('contact-item');
        if (contactItemField) {
            contactItemField.value = message;
        }

        toggleCart();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }

    // Contact Form Submission Logic
    /*const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const email = document.getElementById('contact-email').value;
            const item = document.getElementById('contact-item').value;
            
            let whatsappNumber = "201038229597"; // Same number used for cart
            let message = `*New Contact Request:*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Desired Item / Inquiry:* ${item}`;
            
            let url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            
            // Optionally clear the form after submission
            contactForm.reset();
        });
    }*/
});