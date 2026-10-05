/* ==========================================================================
   BEET & BOOK - TIENDA EN LÍNEA, CARRITO Y CHECKOUT
   Permite la compra segura de libros con activación inmediata en la biblioteca digital
   para lectura online protegida.
   ========================================================================== */

class BeetStore {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    try {
      const data = localStorage.getItem('beet_cart');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('beet_cart', JSON.stringify(this.cart));
    this.updateCartBadge();
  }

  addToCart(bookId) {
    const books = window.beetState ? window.beetState.books : [];
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const existing = this.cart.find(item => item.id === bookId);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.cart.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        coverColor: book.coverColor,
        coverIcon: book.coverIcon,
        quantity: 1
      });
    }

    this.saveCart();
    this.renderCartDrawer();
    this.openCart();
    window.showToast(`🛒 "${book.title}" añadido al carrito`);
  }

  removeFromCart(bookId) {
    this.cart = this.cart.filter(item => item.id !== bookId);
    this.saveCart();
    this.renderCartDrawer();
  }

  updateQuantity(bookId, delta) {
    const item = this.cart.find(i => i.id === bookId);
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;
    if (item.quantity <= 0) {
      this.removeFromCart(bookId);
    } else {
      this.saveCart();
      this.renderCartDrawer();
    }
  }

  openCart() {
    const drawer = document.getElementById('cart-drawer-overlay');
    if (drawer) {
      this.renderCartDrawer();
      drawer.classList.add('active');
    }
  }

  closeCart() {
    const drawer = document.getElementById('cart-drawer-overlay');
    if (drawer) drawer.classList.remove('active');
  }

  renderCartDrawer() {
    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const totalEl = document.getElementById('cart-total-val');
    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 10px;">🛍️</div>
          <h4>Tu carrito está vacío</h4>
          <p style="font-size: 0.85rem; margin-top: 6px;">Explora el catálogo y añade tus novelas y ensayos preferidos.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;

    itemsContainer.innerHTML = this.cart.map(item => {
      const itemSubtotal = item.price * (item.quantity || 1);
      subtotal += itemSubtotal;

      return `
        <div class="cart-item">
          <div class="cart-item-img" style="background: ${item.coverColor || '#312e81'};">
            ${item.coverIcon || '📖'}
          </div>
          <div class="cart-item-details">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${item.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-secondary);">${item.author}</div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
              <span style="font-weight: 700; color: var(--accent-gold);">$${item.price.toFixed(2)}</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn btn-secondary btn-sm" style="padding: 2px 8px;" onclick="window.beetStore.updateQuantity('${item.id}', -1)">-</button>
                <span style="font-size: 0.85rem;">${item.quantity || 1}</span>
                <button class="btn btn-secondary btn-sm" style="padding: 2px 8px;" onclick="window.beetStore.updateQuantity('${item.id}', 1)">+</button>
                <button class="action-btn-link" style="color: #ef4444; margin-left: 6px;" onclick="window.beetStore.removeFromCart('${item.id}')">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  updateCartBadge() {
    const badge = document.getElementById('navbar-cart-badge');
    if (!badge) return;
    const totalCount = this.cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  openCheckout() {
    if (this.cart.length === 0) {
      window.showToast('El carrito está vacío', 'warning');
      return;
    }

    this.closeCart();
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const summaryEl = document.getElementById('checkout-order-summary');
    const totalValEl = document.getElementById('checkout-total-val');

    let total = 0;
    if (summaryEl) {
      summaryEl.innerHTML = this.cart.map(i => {
        const itemTotal = i.price * (i.quantity || 1);
        total += itemTotal;
        return `
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
            <span>${i.title} (x${i.quantity || 1})</span>
            <strong>$${itemTotal.toFixed(2)}</strong>
          </div>
        `;
      }).join('');
    }

    if (totalValEl) totalValEl.textContent = `$${total.toFixed(2)}`;
    modal.classList.add('active');
  }

  closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
  }

  confirmPurchase() {
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');

    if (!nameInput.value.trim() || !emailInput.value.trim()) {
      window.showToast('Por favor completa tu nombre y correo para la compra', 'warning');
      return;
    }

    // Agregar libros comprados a la biblioteca personal del usuario
    if (window.beetState) {
      this.cart.forEach(cartItem => {
        const alreadyInLib = window.beetState.myLibrary.some(b => b.id === cartItem.id);
        if (!alreadyInLib) {
          const originalBook = window.beetState.books.find(b => b.id === cartItem.id);
          if (originalBook) {
            window.beetState.myLibrary.push({
              ...originalBook,
              purchasedDate: new Date().toLocaleDateString()
            });
          }
        }
      });
      localStorage.setItem('beet_my_library', JSON.stringify(window.beetState.myLibrary));
    }

    // Vaciar carrito
    this.cart = [];
    this.saveCart();
    this.closeCheckout();

    // Actualizar vista de mi biblioteca si está abierta
    if (window.renderMyLibrary) window.renderMyLibrary();

    // Notificación y felicitación
    window.showToast('🎉 ¡Compra completada con éxito! Tus libros se añadieron a "Mi Biblioteca" para lectura en línea.', 'music');

    // Cambiar a la vista de biblioteca
    window.switchView('library');
  }
}

window.beetStore = new BeetStore();
