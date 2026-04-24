document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // Keep it somewhat dark or wait, let's toggle it properly
            if (window.scrollY < 50) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealFunction = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealFunction);
    revealFunction(); // Trigger on load

    // Parallax effect for background images and specific elements
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    const parallaxImgs = document.querySelectorAll('.parallax-img');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        parallaxBgs.forEach(bg => {
            // Move background slower than scroll
            const speed = 0.4;
            bg.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
        });
    });

    // Generate floating particles (nature vibe like pollen/spores)
    const particleContainer = document.getElementById('particles-container');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random horizontal start position
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Random animation duration between 15s and 35s
        const duration = Math.random() * 20 + 15;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay to stagger the start
        const delay = Math.random() * 20;
        particle.style.animationDelay = `-${delay}s`; // Negative delay to start immediately at different points

        particleContainer.appendChild(particle);
    }

    // Cart Logic
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const addCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    let cart = [];

    function openCart() {
        if(cartOverlay) cartOverlay.classList.add('active');
    }

    function closeCart() {
        if(cartOverlay) cartOverlay.classList.remove('active');
    }

    if(cartIconBtn) {
        cartIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if(closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if(cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if(e.target === cartOverlay) closeCart();
        });
    }

    if(addCartBtns) {
        addCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                
                const existingItem = cart.find(item => item.name === name);
                if(existingItem) {
                    existingItem.qty++;
                } else {
                    cart.push({ name, price, qty: 1 });
                }
                
                updateCartUI();
                openCart();
            });
        });
    }

    function updateCartUI() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="decrease-qty" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                        <span class="cart-item-qty">${item.qty}</span>
                        <button class="increase-qty" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
        
        if(cartTotalPrice) {
            cartTotalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
        
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                cart[idx].qty++;
                updateCartUI();
            });
        });
        
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartUI();
            });
        });
    }

    // Checkout via WhatsApp
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            let message = "Olá! Gostaria de finalizar meu pedido na Bolladinho:%0A%0A";
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                total += itemTotal;
                message += `${item.qty}x ${item.name} - R$ ${itemTotal.toFixed(2).replace('.', ',')}%0A`;
            });

            message += `%0A*Total: R$ ${total.toFixed(2).replace('.', ',')}*%0A%0A`;
            message += "Como podemos prosseguir com o pagamento e a entrega?";

            // Número do WhatsApp configurado no footer
            const phoneNumber = "5561995636229"; 
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    // Initialize UI
    updateCartUI();
});
