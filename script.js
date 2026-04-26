const addBtn1 = document.getElementById('add-1-btn');
const addBtn5 = document.getElementById('add-5-btn');
const cartCountSpan = document.getElementById('cart-count');
const showCart = document.querySelector('.icon-cart');
const basketContainer = document.querySelector('.basket-container');
const emptyCart = document.querySelector('.empty-cart');
const basketFilled = document.querySelector('.basket-filled');
const checkoutBtn = document.getElementById('checkout-btn');

let cartItems = [];

function updateCartUI() {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity > 0) {
        cartCountSpan.textContent = totalQuantity;
        cartCountSpan.style.display = 'flex';
        emptyCart.style.display = 'none';
        basketFilled.style.display = 'block';
    } else {
        cartCountSpan.style.display = 'none';
        emptyCart.style.display = 'block';
        basketFilled.style.display = 'none';
    }

    renderCartItems();
}

function renderCartItems() {
    // Remove existing items and summary
    const oldItems = basketFilled.querySelectorAll('.product-info-cart');
    oldItems.forEach(item => item.remove());

    const oldSummary = basketFilled.querySelector('.cart-total-summary');
    if (oldSummary) oldSummary.remove();

    // Create item rows
    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'product-info-cart';
        itemDiv.innerHTML = `
            <img class="img-cart" src="./images/nitro.png" alt="product image" width="50" height="50">
            <div class="product-name">
                <p>${item.name}</p>
                <p class="p-price-cart">${item.price} EGP x <span class="count-cart">${item.quantity}</span> <span class="total-price">${(item.price * item.quantity)} EGP</span></p>
            </div>
            <button class="delete-btn" data-index="${index}"><img src="./images/icon-delete.svg" alt="Delete icon"></button>
        `;
        basketFilled.insertBefore(itemDiv, checkoutBtn);
    });

    // Create total summary row
    if (cartItems.length > 0) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'cart-total-summary';
        summaryDiv.style.display = 'flex';
        summaryDiv.style.justifyContent = 'space-between';
        summaryDiv.style.paddingBlock = '1rem';
        summaryDiv.style.marginBottom = '1rem';
        summaryDiv.style.borderTop = '1px solid var(--accent)';
        summaryDiv.style.color = 'var(--white)';
        summaryDiv.style.fontSize = '1.1rem';
        summaryDiv.style.fontWeight = 'bold';

        const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        summaryDiv.innerHTML = `<span>Total:</span><span>${totalPrice} EGP</span>`;
        basketFilled.insertBefore(summaryDiv, checkoutBtn);
    }

    // Bind delete handlers
    const deleteBtns = basketFilled.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.delete-btn');
            const idx = parseInt(targetBtn.getAttribute('data-index'));
            cartItems.splice(idx, 1);
            updateCartUI();
        });
    });
}

function addToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    // Show cart automatically
    basketContainer.style.display = 'block';
}

addBtn1.addEventListener('click', () => {
    addToCart('Ethanol Fuel Additive (1L)', 229);
});

addBtn5.addEventListener('click', () => {
    addToCart('Ethanol Fuel Additive (5L)', 600);
});

showCart.addEventListener('click', () => {
    basketContainer.style.display = basketContainer.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (event) => {
    // Close cart if clicked outside
    if (!basketContainer.contains(event.target) &&
        !showCart.contains(event.target) &&
        !event.target.closest('.add-to-cart-btn') &&
        !event.target.closest('.delete-btn')) {
        basketContainer.style.display = 'none';
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) return;

    let orderDetails = "Hello, I would like to order:\n";
    cartItems.forEach(item => {
        orderDetails += `- ${item.quantity}x ${item.name} (${item.price * item.quantity} EGP)\n`;
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    orderDetails += `\nTotal: ${totalPrice} EGP`;

    const contactItemTextarea = document.getElementById('contact-item');
    if (contactItemTextarea) {
        contactItemTextarea.value = orderDetails;
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Close the cart
    basketContainer.style.display = 'none';
});

// Boot up
updateCartUI();

