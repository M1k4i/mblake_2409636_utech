let cart = JSON.parse(localStorage.getItem('tp_cart')) || [];

const cartContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyMessage = document.getElementById('emptyMessage');
const cartTableWrap = document.getElementById('cartTableWrap');

function renderCart() {
    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartTableWrap.style.display = 'none';
        cartTotal.innerText = "$0.00";
        return;
    }

    emptyMessage.style.display = 'none';
    cartTableWrap.style.display = 'block';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity">
                    <button class="qty-minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-plus" data-index="${index}">+</button>
                </div>
            </div>
            <div class="item-total">$${itemTotal.toFixed(2)}</div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;

        cartContainer.appendChild(div);
    });

    cartTotal.innerText = "$" + total.toFixed(2);
    document.getElementById('total').innerText = "$" + total.toFixed(2);

    attachCartButtons();
}

function attachCartButtons() {
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = btn.dataset.index;
            cart[i].quantity++;
            updateCart();
        });
    });

    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = btn.dataset.index;
            if (cart[i].quantity > 1) {
                cart[i].quantity--;
            } else {
                cart.splice(i, 1);
            }
            updateCart();
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = btn.dataset.index;
            cart.splice(i, 1);
            updateCart();
        });
    });
}

function updateCart() {
    localStorage.setItem('tp_cart', JSON.stringify(cart));
    renderCart();
}

document.getElementById('continueBtn')?.addEventListener('click', () => {
    window.location.href = 'products.html';
});

document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert('Your cart is empty!');
    }
});

renderCart();