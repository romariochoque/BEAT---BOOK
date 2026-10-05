/* ==========================================================================
   BEET & BOOK - LECTOR EN LÍNEA PROTEGIDO (ANTI-DESCARGA Y ANTI-COPIA)
   Permite disfrutar de la lectura inmersiva con ambientación musical
   y previene la copia o descarga indebida del contenido literario.
   ========================================================================== */

class BeetReader {
  constructor() {
    this.currentBook = null;
    this.currentChapterIndex = 0;
    this.fontSize = 18; // px
    this.currentTheme = 'dark'; // dark, sepia, light
    this.modalEl = null;

    this.initSecurityGuards();
  }

  initSecurityGuards() {
    // 1. Deshabilitar menú contextual (clic derecho) dentro del lector
    document.addEventListener('contextmenu', (e) => {
      const modal = document.getElementById('reader-modal');
      if (modal && modal.classList.contains('active')) {
        e.preventDefault();
        window.showToast('🔒 Protección activa: La descarga y copia están deshabilitadas en Beet & Book.', 'warning');
        return false;
      }
    });

    // 2. Interceptar atajos de teclado para guardar, imprimir, copiar o inspeccionar
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('reader-modal');
      if (!modal || !modal.classList.contains('active')) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+S (Guardar), Ctrl+P (Imprimir), Ctrl+C (Copiar), Ctrl+U (Ver código)
      if (cmdOrCtrl && (e.key === 's' || e.key === 'p' || e.key === 'c' || e.key === 'u' || e.key === 'S' || e.key === 'P' || e.key === 'C')) {
        e.preventDefault();
        e.stopPropagation();
        window.showToast('🔒 Obra Protegida: Esta publicación se disfruta exclusivamente en streaming en Beet & Book.', 'warning');
        return false;
      }

      // Escape para cerrar el lector
      if (e.key === 'Escape') {
        this.close();
      }
    });

    // 3. Prevenir arrastrar texto (dragstart)
    document.addEventListener('dragstart', (e) => {
      const modal = document.getElementById('reader-modal');
      if (modal && modal.classList.contains('active')) {
        e.preventDefault();
        return false;
      }
    });
  }

  open(bookId) {
    const books = window.beetState ? window.beetState.books : [];
    const book = books.find(b => b.id === bookId);
    if (!book) {
      window.showToast('Libro no encontrado', 'error');
      return;
    }

    this.currentBook = book;
    this.currentChapterIndex = 0;

    const modal = document.getElementById('reader-modal');
    if (!modal) return;

    this.render();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Ofrecer reproducir automáticamente la banda sonora recomendada
    if (book.recommendedTrack && window.beetPlayer) {
      window.showToast(`🎶 Soundtrack recomendado para esta lectura: "${book.recommendedTrack}"`, 'music');
    }
  }

  close() {
    const modal = document.getElementById('reader-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
  }

  render() {
    if (!this.currentBook) return;

    const titleEl = document.getElementById('reader-book-title');
    const authorEl = document.getElementById('reader-book-author');
    const chapterHeadEl = document.getElementById('reader-chapter-title');
    const contentEl = document.getElementById('reader-text-content');
    const prevBtn = document.getElementById('reader-prev-chapter-btn');
    const nextBtn = document.getElementById('reader-next-chapter-btn');
    const watermarkEl = document.getElementById('reader-watermark-text');
    const soundtrackBtn = document.getElementById('reader-play-soundtrack-btn');
    const discussClubBtn = document.getElementById('reader-discuss-club-btn');

    const chapters = this.currentBook.previewChapters || [];
    const chapter = chapters[this.currentChapterIndex] || {
      title: 'Capítulo no disponible',
      content: 'Contenido en proceso de digitalización.'
    };

    if (titleEl) titleEl.textContent = this.currentBook.title;
    if (authorEl) authorEl.textContent = `por ${this.currentBook.author}`;
    if (chapterHeadEl) chapterHeadEl.textContent = chapter.title;
    if (contentEl) {
      contentEl.textContent = chapter.content;
      contentEl.style.fontSize = `${this.fontSize}px`;
    }

    // Marca de agua con nombre de usuario dinámico y marca de tiempo
    const currentUser = window.beetState ? window.beetState.currentUser.name : 'Lector Beet & Book';
    if (watermarkEl) {
      watermarkEl.textContent = `BEET & BOOK • PROPIEDAD DIGITAL DE ${currentUser.toUpperCase()} • NO DESCARGABLE`;
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentChapterIndex === 0;
      prevBtn.style.opacity = this.currentChapterIndex === 0 ? '0.4' : '1';
    }

    if (nextBtn) {
      const isLast = this.currentChapterIndex >= chapters.length - 1;
      nextBtn.disabled = isLast;
      nextBtn.style.opacity = isLast ? '0.4' : '1';
    }

    if (soundtrackBtn && this.currentBook.recommendedTrack) {
      soundtrackBtn.innerHTML = `🎧 Escuchar "${this.currentBook.recommendedTrack}"`;
      soundtrackBtn.onclick = () => {
        window.beetPlayer.playTrackByTitle(this.currentBook.recommendedTrack);
      };
    }

    if (discussClubBtn) {
      discussClubBtn.onclick = () => {
        this.close();
        window.navigateToCommunityForBook(this.currentBook.id);
      };
    }

    // Scroll al inicio del viewport
    const viewport = document.getElementById('reader-scroll-area');
    if (viewport) viewport.scrollTop = 0;
  }

  nextChapter() {
    if (!this.currentBook) return;
    const chapters = this.currentBook.previewChapters || [];
    if (this.currentChapterIndex < chapters.length - 1) {
      this.currentChapterIndex++;
      this.render();
    }
  }

  prevChapter() {
    if (!this.currentBook) return;
    if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
      this.render();
    }
  }

  changeTheme(themeName) {
    this.currentTheme = themeName;
    const box = document.getElementById('reader-box');
    if (!box) return;

    box.classList.remove('reader-theme-dark', 'reader-theme-sepia', 'reader-theme-light');
    box.classList.add(`reader-theme-theme-${themeName}`.replace('-theme-', '-'));
  }

  adjustFontSize(delta) {
    this.fontSize = Math.min(28, Math.max(14, this.fontSize + delta));
    const contentEl = document.getElementById('reader-text-content');
    if (contentEl) {
      contentEl.style.fontSize = `${this.fontSize}px`;
    }
  }
}

window.beetReader = new BeetReader();
