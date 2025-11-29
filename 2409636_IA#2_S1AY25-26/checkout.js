document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const orderItems = document.getElementById('orderItems');
    const coSubtotal = document.getElementById('coSubtotal');
    const coShipping = document.getElementById('coShipping');
    const coTotal = document.getElementById('coTotal');

    let cart = JSON.parse(localStorage.getItem('tp_cart')) || [];

    function initializeCheckout() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            orderForm.style.display = 'none';
            return;
        }

        emptyCartMessage.style.display = 'none';
        orderForm.style.display = 'flex';
        renderOrderSummary();
        setupFormValidation();
    }

    function renderOrderSummary() {
        orderItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="order-item-info">
                    <span class="order-item-name">${item.name} × ${item.quantity}</span>
                    <span class="order-item-price">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
            orderItems.appendChild(itemElement);
        });

        const shipping = 200.00;
        const total = subtotal + shipping;

        coSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        coShipping.textContent = `$${shipping.toFixed(2)}`;
        coTotal.textContent = `$${total.toFixed(2)}`;
    }

    function setupFormValidation() {
        document.getElementById('cardNumber').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        document.getElementById('expiryDate').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        document.getElementById('cvv').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                processOrder();
            }
        });
    }

    function validateForm() {
        const fields = [
            'fullname', 'email', 'phone', 'address', 'city', 'postcode', 
            'cardNumber', 'expiryDate', 'cvv'
        ];

        let isValid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();

            if (!value) {
                showError(field, 'This field is required');
                isValid = false;
            } else {
                clearError(field);
                
                switch(fieldId) {
                    case 'email':
                        if (!isValidEmail(value)) {
                            showError(field, 'Please enter a valid email address');
                            isValid = false;
                        }
                        break;
                    case 'phone':
                        if (!isValidPhone(value)) {
                            showError(field, 'Please enter a valid phone number');
                            isValid = false;
                        }
                        break;
                    case 'cardNumber':
                        if (value.replace(/\s/g, '').length !== 16) {
                            showError(field, 'Please enter a valid 16-digit card number');
                            isValid = false;
                        }
                        break;
                    case 'expiryDate':
                        if (!isValidExpiry(value)) {
                            showError(field, 'Please enter a valid expiry date (MM/YY)');
                            isValid = false;
                        }
                        break;
                    case 'cvv':
                        if (value.length !== 3) {
                            showError(field, 'Please enter a valid 3-digit CVV');
                            isValid = false;
                        }
                        break;
                }
            }
        });

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function isValidExpiry(expiry) {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        
        const [month, year] = expiry.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        return (month >= 1 && month <= 12) && 
               (year > currentYear || (year === currentYear && month >= currentMonth));
    }

    function showError(field, message) {
        field.style.borderColor = '#ff4444';
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function processOrder() {
        const formData = {
            customer: {
                name: document.getElementById('fullname').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                postcode: document.getElementById('postcode').value.trim()
            },
            order: {
                items: cart,
                subtotal: parseFloat(coSubtotal.textContent.replace('$', '')),
                shipping: parseFloat(coShipping.textContent.replace('$', '')),
                total: parseFloat(coTotal.textContent.replace('$', ''))
            },
            timestamp: new Date().toISOString(),
            orderId: 'TP-' + Date.now()
        };

        const orders = JSON.parse(localStorage.getItem('tp_orders')) || [];
        orders.push(formData);
        localStorage.setItem('tp_orders', JSON.stringify(orders));

        localStorage.removeItem('tp_cart');
        cart = [];

        showOrderSuccess(formData.orderId);
    }

    function showOrderSuccess(orderId) {
        const successHTML = `
            <div class="order-success">
                <ion-icon name="checkmark-circle" class="success-icon"></ion-icon>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order. Your order number is: <strong>${orderId}</strong></p>
                <p>A confirmation email has been sent to your email address.</p>
                <div class="success-actions">
                    <button onclick="window.location.href='products.html'" class="cart-add">Continue Shopping</button>
                    <button onclick="window.location.href='mainpage.html'" class="cart-add secondary">Return Home</button>
                </div>
            </div>
        `;

        document.querySelector('.checkout-container').innerHTML = successHTML;
    }

    initializeCheckout();
});