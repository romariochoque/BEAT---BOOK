/* ==========================================================================
   BEET & BOOK - APLICACIÓN PRINCIPAL (APP.JS)
   Coordina el estado global, navegación de pestañas, envío de música
   entre usuarios, renderizado de catálogos y persistencia.
   ========================================================================== */

// Estado global de la aplicación
window.beetState = {
  currentUser: {
    id: 'user-0',
    name: 'Julián C.',
    avatar: '☕',
    role: 'Lector & Melómano'
  },
  books: [],
  tracks: [],
  communities: [],
  friends: [],
  receivedMusic: [],
  myLibrary: []
};

// Cargar o inicializar datos
async function initAppData() {
  let seed = window.BEET_DEFAULT_DATA || null;

  try {
    // Intentar leer seed.json vía fetch
    const res = await fetch('data/seed.json');
    if (res.ok) {
      seed = await res.json();
    }
  } catch (err) {
    console.info('Utilizando datos embebidos de BEET_DEFAULT_DATA.');
  }

  if (seed) {
    window.beetState.books = seed.books || [];
    window.beetState.tracks = seed.tracks || [];
    window.beetState.friends = seed.friends || [];

    // Cargar comunidades desde localStorage si existen, o usar las de seed
    const savedComm = localStorage.getItem('beet_communities');
    window.beetState.communities = savedComm ? JSON.parse(savedComm) : (seed.communities || []);

    // Cargar música recibida
    const savedMailbox = localStorage.getItem('beet_received_music');
    window.beetState.receivedMusic = savedMailbox ? JSON.parse(savedMailbox) : (seed.receivedMusic || []);

    // Cargar mi biblioteca
    const savedLibrary = localStorage.getItem('beet_my_library');
    window.beetState.myLibrary = savedLibrary ? JSON.parse(savedLibrary) : [seed.books[0]];
  }

  // Inicializar reproductor de audio
  if (window.beetPlayer && window.beetState.tracks.length > 0) {
    window.beetPlayer.init(window.beetState.tracks);
  }

  // Renderizar vistas
  renderHome();
  renderBooksCatalog();
  if (window.beetCommunity) window.beetCommunity.renderCommunitiesGrid();
  renderMusicLounge();
  renderMyLibrary();
  renderMailbox();
  updateMailboxBadge();
  if (window.beetStore) window.beetStore.updateCartBadge();
  setupEventListeners();
}

// ==========================================================================
// NAVEGACIÓN ENTRE VISTAS
// ==========================================================================
window.switchView = function(viewName) {
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
    }
  });

  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Si se abre la pestaña de comunidades, renderizar grid
  if (viewName === 'communities' && window.beetCommunity) {
    window.beetCommunity.renderCommunitiesGrid();
  }
};

window.navigateToCommunityForBook = function(bookId) {
  const comm = window.beetState.communities.find(c => c.bookId === bookId);
  if (comm && window.beetCommunity) {
    window.beetCommunity.openClubDetail(comm.id);
  } else {
    window.switchView('communities');
  }
};

// ==========================================================================
// RENDERIZADO DE INICIO (HOME)
// ==========================================================================
function renderHome() {
  const featuredContainer = document.getElementById('home-featured-books');
  if (!featuredContainer) return;

  const featured = window.beetState.books.slice(0, 3);
  featuredContainer.innerHTML = featured.map(book => createBookCardHTML(book)).join('');

  // Sintonía del día / Emparejamiento libro y música
  const dailyPairingBox = document.getElementById('daily-pairing-box');
  if (dailyPairingBox && window.beetState.books.length > 0) {
    const pairBook = window.beetState.books[0];
    dailyPairingBox.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
        <div style="width: 70px; height: 95px; border-radius: 8px; background: ${pairBook.coverColor}; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: var(--shadow-sm);">
          ${pairBook.coverIcon}
        </div>
        <div style="flex-grow: 1;">
          <span style="font-size: 0.76rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Dúo Armónico del Día</span>
          <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: #fff; margin: 2px 0;">${pairBook.title} + "${pairBook.recommendedTrack}"</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 580px;">Experimenta cómo el ritmo del piano jazzístico potencia los misterios y la poesía de este relato en tiempo real.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary btn-sm" onclick="window.beetReader.open('${pairBook.id}')">📖 Leer Online</button>
          <button class="btn btn-music btn-sm" onclick="window.beetPlayer.playTrackByTitle('${pairBook.recommendedTrack}')">▶ Sonar Track</button>
        </div>
      </div>
    `;
  }
}

// ==========================================================================
// RENDERIZADO DEL CATÁLOGO DE LIBROS
// ==========================================================================
function renderBooksCatalog(filterGenre = 'all', searchQuery = '') {
  const container = document.getElementById('books-catalog-grid');
  if (!container) return;

  let books = window.beetState.books;

  if (filterGenre !== 'all') {
    books = books.filter(b => b.genre.toLowerCase().includes(filterGenre.toLowerCase()));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }

  if (books.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🔎</div>
        <h3>No encontramos libros con esos criterios</h3>
        <p>Prueba con otro género o término de búsqueda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = books.map(book => createBookCardHTML(book)).join('');
}

function createBookCardHTML(book) {
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover" style="background: radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 70%);" onclick="window.beetReader.open('${book.id}')">
        <span class="book-badge-pill">${book.badge || 'Digital'}</span>
        <div class="book-cover-artwork" style="background: ${book.coverColor};">
          <span class="icon-large">${book.coverIcon}</span>
          <span class="cover-mini-title">${book.title}</span>
        </div>
      </div>
      <div class="book-body">
        <span class="book-genre">${book.genre}</span>
        <h3 class="book-title" onclick="window.beetReader.open('${book.id}')">${book.title}</h3>
        <span class="book-author">por ${book.author}</span>
        <p class="book-desc">${book.description}</p>
        
        ${book.recommendedTrack ? `
          <div class="book-soundtrack-tag" onclick="window.beetPlayer.playTrackByTitle('${book.recommendedTrack}')">
            <span>🎶</span>
            <span>Escuchar con: <strong>${book.recommendedTrack}</strong></span>
          </div>
        ` : ''}

        <div class="book-footer">
          <div class="book-price-box">
            <span class="book-price-label">Precio digital</span>
            <span class="book-price-val">$${book.price.toFixed(2)}</span>
          </div>
          <div class="book-actions-group">
            <button class="btn btn-secondary btn-sm" onclick="window.beetReader.open('${book.id}')" title="Lectura digital protegida">
              📖 Leer Online
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.beetStore.addToCart('${book.id}')" title="Comprar libro">
              🛒 Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// SALA DE MÚSICA & GESTIÓN DE PISTAS
// ==========================================================================
function renderMusicLounge() {
  const container = document.getElementById('music-tracks-table');
  if (!container) return;

  const tracks = window.beetState.tracks;

  container.innerHTML = tracks.map((track, idx) => `
    <div class="track-row-item" data-id="${track.id}">
      <div class="track-left-info">
        <div class="track-play-badge" onclick="window.beetPlayer.playTrackById('${track.id}')">
          ${track.cover || '▶'}
        </div>
        <div class="track-meta">
          <div class="track-name-bold">${track.title}</div>
          <div class="track-artist-sub">${track.artist}</div>
        </div>
      </div>

      <div class="track-tags-col">
        <span class="track-mood-badge">${track.genre}</span>
        <span class="track-mood-badge" style="color: var(--accent-gold);">${track.mood}</span>
      </div>

      <div class="track-actions-col">
        <span style="font-size: 0.8rem; color: var(--text-muted);">${track.duration}</span>
        <button class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.78rem;" onclick="openSendMusicModal('${track.id}')" title="Dedicar a un usuario">
          📤 Enviar
        </button>
        <button class="btn btn-primary btn-sm" style="padding: 4px 10px; font-size: 0.78rem;" onclick="window.beetPlayer.playTrackById('${track.id}')">
          ▶ Tocar
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// SISTEMA DE ENVIAR MÚSICA A OTROS USUARIOS
// ==========================================================================
window.openSendMusicModal = function(trackId = null) {
  const modal = document.getElementById('send-music-modal');
  if (!modal) return;

  // Rellenar usuarios destinatarios
  const userSelect = document.getElementById('send-recipient-select');
  if (userSelect) {
    userSelect.innerHTML = window.beetState.friends.map(f => `
      <option value="${f.id}">${f.avatar} ${f.name} (${f.status})</option>
    `).join('') + `<option value="comm">🌐 Publicar en un Club de Lectura</option>`;
  }

  // Rellenar pistas musicales
  const trackSelect = document.getElementById('send-track-select');
  if (trackSelect) {
    trackSelect.innerHTML = window.beetState.tracks.map(t => `
      <option value="${t.id}" ${t.id === trackId ? 'selected' : ''}>🎵 ${t.title} - ${t.artist}</option>
    `).join('');
  }

  modal.classList.add('active');
};

window.closeSendMusicModal = function() {
  const modal = document.getElementById('send-music-modal');
  if (modal) modal.classList.remove('active');
};

window.submitSendMusic = function() {
  const recipientSelect = document.getElementById('send-recipient-select');
  const trackSelect = document.getElementById('send-track-select');
  const noteInput = document.getElementById('send-note-input');

  const selectedUserId = recipientSelect.value;
  const selectedTrackId = trackSelect.value;
  const note = noteInput.value.trim() || '¡Te comparto esta hermosa melodía para acompañar tus lecturas!';

  const track = window.beetState.tracks.find(t => t.id === selectedTrackId);
  if (!track) return;

  if (selectedUserId === 'comm') {
    // Si se envía a un club, agregar a las discusiones del primer club
    const club = window.beetState.communities[0];
    if (club) {
      if (!club.discussions) club.discussions = [];
      club.discussions.unshift({
        id: 'disc-' + Date.now(),
        author: window.beetState.currentUser.name,
        avatar: window.beetState.currentUser.avatar,
        date: 'Justo ahora',
        title: `Música compartida: "${track.title}"`,
        content: note,
        likes: 1,
        sharedTrack: track.title,
        comments: []
      });
      localStorage.setItem('beet_communities', JSON.stringify(window.beetState.communities));
    }
    window.showToast(`🎶 ¡Pista "${track.title}" compartida en el Club de Lectura!`, 'music');
  } else {
    // Enviar a un amigo ficticio
    const recipient = window.beetState.friends.find(f => f.id === selectedUserId);
    const recipientName = recipient ? recipient.name : 'Usuario';

    // Para efecto interactivo, además guardamos una confirmación en el buzón
    const newDedication = {
      id: 'rec-' + Date.now(),
      from: `Tú (hacia ${recipientName})`,
      avatar: '💌',
      trackTitle: track.title,
      note: note,
      date: 'Enviado hoy',
      trackId: track.id
    };

    window.beetState.receivedMusic.unshift(newDedication);
    localStorage.setItem('beet_received_music', JSON.stringify(window.beetState.receivedMusic));
    renderMailbox();
    updateMailboxBadge();

    window.showToast(`✨ ¡Canción y dedicatoria enviadas exitosamente a ${recipientName}!`, 'music');
  }

  noteInput.value = '';
  closeSendMusicModal();
};

// Renderizar buzón de música recibida
function renderMailbox() {
  const container = document.getElementById('music-mailbox-list');
  if (!container) return;

  const list = window.beetState.receivedMusic || [];

  if (list.length === 0) {
    container.innerHTML = `
      <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 14px;">
        Tu buzón está vacío por ahora. ¡Envía música a otros usuarios para que te respondan!
      </p>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="mailbox-item">
      <div class="mailbox-sender">
        <span>${item.avatar} ${item.from}</span>
        <span style="margin-left: auto; font-size: 0.72rem; color: var(--text-muted);">${item.date}</span>
      </div>
      <div class="mailbox-note">"${item.note}"</div>
      <div class="mailbox-song-pill">
        <span>🎵 ${item.trackTitle}</span>
        <button class="btn btn-primary btn-sm" style="padding: 2px 8px; font-size: 0.75rem;" onclick="window.beetPlayer.playTrackByTitle('${item.trackTitle}')">
          Escuchar ▶
        </button>
      </div>
    </div>
  `).join('');
}

function updateMailboxBadge() {
  const badge = document.getElementById('mailbox-badge-count');
  if (badge) {
    badge.textContent = window.beetState.receivedMusic.length;
  }
}

// ==========================================================================
// RENDERIZADO DE "MI BIBLIOTECA"
// ==========================================================================
window.renderMyLibrary = function() {
  const container = document.getElementById('my-library-grid');
  if (!container) return;

  const library = window.beetState.myLibrary || [];

  if (library.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">📚</div>
        <h3>Tu estantería personal está esperando tus lecturas</h3>
        <p style="max-width: 500px; margin: 8px auto 20px;">Adquiere libros en la tienda online para disfrutarlos en cualquier momento en streaming protegido.</p>
        <button class="btn btn-primary" onclick="window.switchView('books')">Explorar Tienda y Catálogo</button>
      </div>
    `;
    return;
  }

  container.innerHTML = library.map(book => `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover" style="background: radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 70%);" onclick="window.beetReader.open('${book.id}')">
        <span class="book-badge-pill" style="color: #4ade80;">✓ En tu Biblioteca</span>
        <div class="book-cover-artwork" style="background: ${book.coverColor};">
          <span class="icon-large">${book.coverIcon}</span>
          <span class="cover-mini-title">${book.title}</span>
        </div>
      </div>
      <div class="book-body">
        <span class="book-genre">${book.genre}</span>
        <h3 class="book-title" onclick="window.beetReader.open('${book.id}')">${book.title}</h3>
        <span class="book-author">por ${book.author}</span>
        <p class="book-desc">${book.description}</p>

        <div style="display: flex; gap: 8px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-color);">
          <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.beetReader.open('${book.id}')">
            📖 Continuar Leyendo
          </button>
          <button class="btn btn-music btn-sm" onclick="window.beetPlayer.playTrackByTitle('${book.recommendedTrack}')" title="Tocar soundtrack">
            🎶
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.navigateToCommunityForBook('${book.id}')" title="Ir al Club">
            👥
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

// ==========================================================================
// HELPER DE NOTIFICACIONES TOAST
// ==========================================================================
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'music' ? 'music-toast' : ''}`;
  toast.innerHTML = `
    <span>${type === 'music' ? '🎵' : type === 'warning' ? '🔒' : '✨'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// ==========================================================================
// EVENT LISTENERS & INICIALIZACIÓN DE CONTROLES
// ==========================================================================
function setupEventListeners() {
  // Filtros de libros
  document.querySelectorAll('.books-filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.books-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const genre = chip.dataset.genre || 'all';
      const searchVal = document.getElementById('book-search-input') ? document.getElementById('book-search-input').value : '';
      renderBooksCatalog(genre, searchVal);
    });
  });

  // Búsqueda de libros
  const searchInput = document.getElementById('book-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeChip = document.querySelector('.books-filter-chip.active');
      const genre = activeChip ? activeChip.dataset.genre : 'all';
      renderBooksCatalog(genre, e.target.value);
    });
  }

  // Filtros de comunidades
  document.querySelectorAll('.comm-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.comm-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (window.beetCommunity) {
        window.beetCommunity.currentFilter = chip.dataset.cat || 'all';
        window.beetCommunity.renderCommunitiesGrid();
      }
    });
  });

  // Control deslizante de barra de progreso del reproductor
  const progressTrack = document.getElementById('player-progress-bar');
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (window.beetPlayer) {
        window.beetPlayer.seekToPercent(clickPos);
      }
    });
  }

  // Control de volumen general
  const volumeSlider = document.getElementById('player-volume-slider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (window.beetPlayer) window.beetPlayer.setVolume(e.target.value);
    });
  }

  // Mezclador de ambiente: Lluvia
  const rainSlider = document.getElementById('ambient-rain-slider');
  if (rainSlider) {
    rainSlider.addEventListener('input', (e) => {
      if (window.beetPlayer) window.beetPlayer.setRainVolume(e.target.value);
    });
  }

  // Mezclador de ambiente: Vinilo
  const vinylSlider = document.getElementById('ambient-vinyl-slider');
  if (vinylSlider) {
    vinylSlider.addEventListener('input', (e) => {
      if (window.beetPlayer) window.beetPlayer.setVinylVolume(e.target.value);
    });
  }
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  initAppData();
});
