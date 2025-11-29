let cart = JSON.parse(localStorage.getItem('tp_cart')) || [];

document.querySelectorAll('.cart-add').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.products-card');

        const item = {
            id: card.dataset.id,
            name: card.querySelector('h3').innerText,
            price: parseFloat(card.querySelector('.price').innerText.replace('$','')),
            image: card.querySelector('img').src,
            quantity: 1
        };

        const existing = cart.find(p => p.id === item.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem('tp_cart', JSON.stringify(cart));

        alert(`${item.name} added to cart!`);
    });
});