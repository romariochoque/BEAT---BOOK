/* ==========================================================================
   BEET & BOOK - GESTOR DE COMUNIDADES Y CLUBES DE LECTURA
   Permite a los usuarios crear comunidades, debatir sobre libros,
   vincular música a sus debates y unirse a clubes activos.
   ========================================================================== */

class BeetCommunityManager {
  constructor() {
    this.activeClubId = null;
    this.currentFilter = 'all';
  }

  getCommunities() {
    return window.beetState ? window.beetState.communities : [];
  }

  saveCommunities(communities) {
    if (window.beetState) {
      window.beetState.communities = communities;
      localStorage.setItem('beet_communities', JSON.stringify(communities));
    }
  }

  renderCommunitiesGrid() {
    const container = document.getElementById('communities-cards-container');
    if (!container) return;

    let communities = this.getCommunities();

    if (this.currentFilter !== 'all') {
      communities = communities.filter(c => 
        c.category.toLowerCase().includes(this.currentFilter.toLowerCase())
      );
    }

    if (communities.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">📚🎶</div>
          <h3>No se encontraron clubes en esta categoría</h3>
          <p>¡Sé el primero en fundar un nuevo club de lectura para esta temática!</p>
          <button class="btn btn-primary btn-sm" style="margin-top: 16px;" onclick="window.beetCommunity.openCreateModal()">
            ✨ Crear Este Club Ahora
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = communities.map(club => `
      <div class="community-card" data-id="${club.id}">
        <div class="community-banner" style="background: ${club.bannerColor || 'linear-gradient(135deg, #1e1b4b, #312e81)'};">
          <span class="community-category-pill">${club.category}</span>
          <div class="community-icon-bubble">${club.icon || '📖'}</div>
        </div>
        <div class="community-content">
          <h3 class="community-name" onclick="window.beetCommunity.openClubDetail('${club.id}')">${club.name}</h3>
          <p class="community-desc">${club.description}</p>
          
          <div class="community-reading-now">
            <div class="community-reading-info">
              <span>📖 Leyendo:</span>
              <strong class="community-reading-title">${club.bookTitle}</strong>
            </div>
            <button class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.beetReader.open('${club.bookId}')">
              Leer
            </button>
          </div>

          <div class="community-stats">
            <div class="community-members">
              <span>👥 ${club.membersCount} miembros</span>
            </div>
            <button class="btn btn-outline-gold btn-sm" onclick="window.beetCommunity.openClubDetail('${club.id}')">
              Entrar al Club →
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  openClubDetail(clubId) {
    const club = this.getCommunities().find(c => c.id === clubId);
    if (!club) return;

    this.activeClubId = clubId;

    // Cambiar a la vista del club
    window.switchView('club-detail');

    const titleEl = document.getElementById('club-detail-title');
    const descEl = document.getElementById('club-detail-desc');
    const iconEl = document.getElementById('club-detail-icon');
    const categoryEl = document.getElementById('club-detail-category');
    const membersEl = document.getElementById('club-detail-members');
    const bookTitleEl = document.getElementById('club-detail-book-title');
    const trackPlayBtn = document.getElementById('club-detail-play-track-btn');
    const readBookBtn = document.getElementById('club-detail-read-book-btn');

    if (titleEl) titleEl.textContent = club.name;
    if (descEl) descEl.textContent = club.description;
    if (iconEl) iconEl.textContent = club.icon || '📖';
    if (categoryEl) categoryEl.textContent = club.category;
    if (membersEl) membersEl.textContent = `${club.membersCount} miembros activos`;
    if (bookTitleEl) bookTitleEl.textContent = club.bookTitle;

    if (trackPlayBtn && club.featuredTrack) {
      trackPlayBtn.innerHTML = `🎵 Escuchar himno: ${club.featuredTrack}`;
      trackPlayBtn.onclick = () => {
        window.beetPlayer.playTrackByTitle(club.featuredTrack);
        window.showToast(`🎶 Reproduciendo sintonía del club: "${club.featuredTrack}"`, 'music');
      };
    }

    if (readBookBtn) {
      readBookBtn.onclick = () => {
        window.beetReader.open(club.bookId);
      };
    }

    this.renderDiscussionsList(club);
  }

  renderDiscussionsList(club) {
    const container = document.getElementById('club-discussions-container');
    if (!container) return;

    const discussions = club.discussions || [];

    if (discussions.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">💬</div>
          <h4>Aún no hay debates iniciados</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Sé la primera persona en compartir una cita, reflexión o canción sobre "${club.bookTitle}".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = discussions.map(disc => `
      <div class="discussion-post-card" data-disc-id="${disc.id}">
        <div class="discussion-header">
          <div class="discussion-user">
            <div class="discussion-avatar">${disc.avatar || '👤'}</div>
            <div>
              <div class="discussion-user-name">${disc.author}</div>
              <div class="discussion-time">${disc.date}</div>
            </div>
          </div>
          <span style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 600;">#Debate</span>
        </div>

        <h4 class="discussion-title">${disc.title}</h4>
        <p class="discussion-body">${disc.content}</p>

        ${disc.sharedTrack ? `
          <div class="discussion-attached-music" onclick="window.beetPlayer.playTrackByTitle('${disc.sharedTrack}')">
            <span>🎵 Canción vinculada al debate:</span>
            <strong>${disc.sharedTrack}</strong>
            <span style="font-size: 0.75rem; background: rgba(139, 92, 246, 0.3); padding: 2px 6px; border-radius: 4px;">▶ Tocar</span>
          </div>
        ` : ''}

        <div class="discussion-footer">
          <button class="action-btn-link" onclick="window.beetCommunity.likeDiscussion('${club.id}', '${disc.id}')">
            ❤️ <span>${disc.likes || 0}</span> Me gusta
          </button>
          <button class="action-btn-link" onclick="window.beetCommunity.toggleReplyBox('${disc.id}')">
            💬 ${(disc.comments || []).length} Respuestas
          </button>
        </div>

        <!-- Hilo de comentarios -->
        <div class="comments-thread" id="comments-${disc.id}">
          ${(disc.comments || []).map(comm => `
            <div class="comment-bubble">
              <div class="comment-user-row">
                <span>${comm.avatar || '👤'} ${comm.author}</span>
                <span class="comment-time">${comm.date}</span>
              </div>
              <p style="color: var(--text-secondary);">${comm.text}</p>
            </div>
          `).join('')}

          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <input type="text" id="reply-input-${disc.id}" class="form-input" style="padding: 6px 12px; font-size: 0.85rem;" placeholder="Escribe una respuesta a este debate...">
            <button class="btn btn-primary btn-sm" onclick="window.beetCommunity.addReply('${club.id}', '${disc.id}')">Enviar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  likeDiscussion(clubId, discId) {
    const communities = this.getCommunities();
    const club = communities.find(c => c.id === clubId);
    if (!club) return;

    const disc = (club.discussions || []).find(d => d.id === discId);
    if (disc) {
      disc.likes = (disc.likes || 0) + 1;
      this.saveCommunities(communities);
      this.renderDiscussionsList(club);
      window.showToast('¡Te ha gustado este aporte!');
    }
  }

  addReply(clubId, discId) {
    const input = document.getElementById(`reply-input-${discId}`);
    if (!input || !input.value.trim()) return;

    const communities = this.getCommunities();
    const club = communities.find(c => c.id === clubId);
    if (!club) return;

    const disc = (club.discussions || []).find(d => d.id === discId);
    if (!disc) return;

    if (!disc.comments) disc.comments = [];

    const currentUser = window.beetState ? window.beetState.currentUser : { name: 'Tú', avatar: '✨' };

    disc.comments.push({
      author: currentUser.name,
      avatar: currentUser.avatar,
      text: input.value.trim(),
      date: 'Justo ahora'
    });

    this.saveCommunities(communities);
    this.renderDiscussionsList(club);
    window.showToast('Tu respuesta ha sido publicada');
    input.value = '';
  }

  toggleReplyBox(discId) {
    const thread = document.getElementById(`comments-${discId}`);
    if (thread) {
      thread.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Crear una nueva discusión dentro del club actual
  createNewDiscussion() {
    if (!this.activeClubId) return;

    const titleInput = document.getElementById('new-disc-title');
    const contentInput = document.getElementById('new-disc-content');
    const musicSelect = document.getElementById('new-disc-music');

    if (!titleInput || !contentInput || !titleInput.value.trim() || !contentInput.value.trim()) {
      window.showToast('Por favor completa el título y el contenido del debate', 'warning');
      return;
    }

    const communities = this.getCommunities();
    const club = communities.find(c => c.id === this.activeClubId);
    if (!club) return;

    if (!club.discussions) club.discussions = [];

    const currentUser = window.beetState ? window.beetState.currentUser : { name: 'Lector Viajero', avatar: '📚' };

    const newDisc = {
      id: 'disc-' + Date.now(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      date: 'Justo ahora',
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      likes: 1,
      sharedTrack: musicSelect ? musicSelect.value : '',
      comments: []
    };

    club.discussions.unshift(newDisc);
    this.saveCommunities(communities);
    this.renderDiscussionsList(club);

    titleInput.value = '';
    contentInput.value = '';
    window.showToast('✨ Debate publicado en el club de lectura');
  }

  // Modal para fundar una nueva comunidad
  openCreateModal() {
    const modal = document.getElementById('create-community-modal');
    if (!modal) return;

    // Poblar libros en el select
    const bookSelect = document.getElementById('comm-book-select');
    if (bookSelect && window.beetState) {
      bookSelect.innerHTML = window.beetState.books.map(b => `
        <option value="${b.id}">${b.title} (${b.author})</option>
      `).join('');
    }

    // Poblar canciones en el select
    const trackSelect = document.getElementById('comm-track-select');
    if (trackSelect && window.beetState) {
      trackSelect.innerHTML = window.beetState.tracks.map(t => `
        <option value="${t.title}">${t.title} - ${t.genre}</option>
      `).join('');
    }

    modal.classList.add('active');
  }

  closeCreateModal() {
    const modal = document.getElementById('create-community-modal');
    if (modal) modal.classList.remove('active');
  }

  submitCreateCommunity() {
    const nameEl = document.getElementById('comm-name-input');
    const catEl = document.getElementById('comm-cat-input');
    const bookSelect = document.getElementById('comm-book-select');
    const trackSelect = document.getElementById('comm-track-select');
    const descEl = document.getElementById('comm-desc-input');
    const iconEl = document.getElementById('comm-icon-input');

    if (!nameEl.value.trim() || !descEl.value.trim()) {
      window.showToast('Por favor escribe un nombre y descripción para tu club', 'warning');
      return;
    }

    const books = window.beetState.books;
    const selectedBook = books.find(b => b.id === bookSelect.value) || books[0];

    const gradients = [
      'linear-gradient(135deg, #1e1b4b, #312e81)',
      'linear-gradient(135deg, #4c1d95, #6d28d9)',
      'linear-gradient(135deg, #064e3b, #047857)',
      'linear-gradient(135deg, #7c2d12, #c2410c)',
      'linear-gradient(135deg, #831843, #be185d)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newClub = {
      id: 'comm-' + Date.now(),
      name: nameEl.value.trim(),
      category: catEl.value || 'Club Literario',
      icon: iconEl.value || '📖',
      bannerColor: randomGradient,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      featuredTrack: trackSelect ? trackSelect.value : 'Midnight Lo-Fi Coffee',
      creator: window.beetState.currentUser.name,
      membersCount: 1,
      description: descEl.value.trim(),
      discussions: [
        {
          id: 'disc-init-' + Date.now(),
          author: window.beetState.currentUser.name,
          avatar: window.beetState.currentUser.avatar,
          date: 'Justo ahora',
          title: `¡Bienvenidos al club de "${selectedBook.title}"!`,
          content: 'He creado esta comunidad para explorar juntos este fascinante libro y disfrutar de las melodías que inspiran cada página. ¡Suma tu comentario o comparte tu cita preferida!',
          likes: 2,
          sharedTrack: trackSelect ? trackSelect.value : '',
          comments: []
        }
      ]
    };

    const communities = this.getCommunities();
    communities.unshift(newClub);
    this.saveCommunities(communities);

    this.closeCreateModal();
    this.renderCommunitiesGrid();
    window.showToast(`🎉 ¡Comunidad "${newClub.name}" creada con éxito!`);

    // Limpiar formulario
    nameEl.value = '';
    descEl.value = '';

    // Abrir directamente el nuevo club
    this.openClubDetail(newClub.id);
  }
}

window.beetCommunity = new BeetCommunityManager();
