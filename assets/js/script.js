/* ═══════════════════════════════════════════════════════
   FORNO NERO – Pizzaria Artesanal
   script.js – Lógica de Cardápio, Carrinho e WhatsApp
════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIGURAÇÃO ────────────────────────────────────── */
const WHATSAPP_NUMBER = '5582988919827'; // ← Troque pelo seu número (com código do país)

/* ─── DADOS DO CARDÁPIO ──────────────────────────────── */
const MENU_ITEMS = [
  // TRADICIONAIS
  {
    id: 1, cat: 'tradicionais',
    name: 'Margherita',
    desc: 'Molho de tomate San Marzano, mozzarella de búfala, manjericão fresco e azeite de oliva extra virgem.',
    img: './assets/imagens/pizza-marguerita.jpg',
    prices: { P: 38, M: 52, G: 66 },
    adicionais: ['Borda de Catupiry (+R$ 8)', 'Extra Queijo (+R$ 5)'],
  },
  {
    id: 2, cat: 'tradicionais',
    name: 'Calabresa',
    desc: 'Molho de tomate, mozzarella, calabresa artesanal fatiada, cebola roxa e azeitonas pretas.',
    img: './assets/imagens/pizza-calabresa-02.jpg',
    prices: { P: 36, M: 50, G: 64 },
    adicionais: ['Borda de Catupiry (+R$ 8)', 'Extra Queijo (+R$ 5)', 'Pimenta (+R$ 2)'],
  },
  {
    id: 3, cat: 'tradicionais',
    name: 'Frango com Catupiry',
    desc: 'Molho de tomate, mozzarella, frango desfiado temperado e generosa camada de catupiry original.',
    img: './assets/imagens/pizza-frango-com-catupiry.jpg',
    prices: { P: 40, M: 54, G: 68 },
    adicionais: ['Borda de Catupiry (+R$ 8)', 'Extra Queijo (+R$ 5)'],
  },
  {
    id: 4, cat: 'tradicionais',
    name: 'Quatro Queijos',
    desc: 'Molho branco, mozzarella, parmesão, gorgonzola e provolone. Cobertura com cebolinha fresca.',
    img: './assets/imagens/pizza-quatro-queijos.jpg',
    prices: { P: 44, M: 58, G: 72 },
    adicionais: ['Borda de Catupiry (+R$ 8)'],
  },

  // ESPECIAIS
  {
    id: 5, cat: 'especiais',
    name: 'Portuguesa',
    desc: 'Presunto, ovos cozidos (picados ou em rodelas), cebola e azeitonas pretas.',
    img: './assets/imagens/pizza-portuguesa.jpg',
    prices: { P: 58, M: 78, G: 98 },
    adicionais: ['Extra Trufado (+R$ 10)', 'Borda de Catupiry (+R$ 8)'],
  },
  {
    id: 6, cat: 'especiais',
    name: 'Camarão ao Alho',
    desc: 'Molho de tomate, mozzarella, camarão rosa refogado no alho e azeite, pimenta-do-reino e salsa.',
    img: './assets/imagens/pizza-camarao-ao-alho.jpg',
    prices: { P: 62, M: 82, G: 105 },
    adicionais: ['Extra Camarão (+R$ 15)', 'Extra Queijo (+R$ 5)'],
  },
  {
    id: 7, cat: 'especiais',
    name: 'Peperoni',
    desc: 'Molho branco, mozzarella, mix de cogumelos hidratados (shiitake, portobello), parmesão e tomilho.',
    img: './assets/imagens/pizza-peperoni.jpg',
    prices: { P: 52, M: 70, G: 88 },
    adicionais: ['Borda de Catupiry (+R$ 8)', 'Extra Queijo (+R$ 5)'],
  },

  // DOCES
  {
    id: 8, cat: 'doces',
    name: 'Alho poró com bacon',
    desc: 'Massa de Pizza, alho-poró fresco, bacon em fatias, mussarela, requeijão, molho de tomate',
    img: './assets/imagens/pizza-alho-poro-com-bacon-edit.webp',
    prices: { P: 40, M: 54, G: 68 },
    adicionais: ['Extra Morango (+R$ 5)', 'Sorvete (+R$ 8)'],
  },
  {
    id: 9, cat: 'doces',
    name: 'Borda de coxinha',
    desc: 'Massa cremosa, com frango e catupiry, e uma borda super recheada com o sabor tradicional da coxinha.',
    img: './assets/imagens/pizza-com-borda-de-coxinha-edit.webp',
    prices: { P: 38, M: 50, G: 64 },
    adicionais: ['Extra Brigadeiro (+R$ 6)'],
  },

  // BEBIDAS
  {
    id: 10, cat: 'bebidas',
    name: 'Refrigerante Lata',
    desc: 'Coca-Cola, Guaraná, Sprite ou Fanta (350ml). Gelado.',
    img: './assets/imagens/refrigerante-03.jpg',
    prices: { Un: 4 },
    adicionais: [],
    naoTemTamanho: true,
  },
  {
    id: 11, cat: 'bebidas',
    name: 'Água Mineral',
    desc: 'Água mineral natural ou com gás (500ml).',
    img: './assets/imagens/agua-mineral.jpg',
    prices: { Un: 3 },
    adicionais: [],
    naoTemTamanho: true,
  },
  {
    id: 12, cat: 'bebidas',
    name: 'Suco Natural',
    desc: 'Laranja, limão, maracujá ou abacaxi. Polpa fruta com pouca ou nenhuma adição de açúcar.',
    img: './assets/imagens/suco-natural.jpg',
    prices: { Un: 6 },
    adicionais: [],
    naoTemTamanho: true,
  },
];

/* ─── ESTADO DO CARRINHO ─────────────────────────────── */
let cart = loadCart();
let currentFilter = 'todos';
let searchQuery = '';

/* ─── UTILITÁRIOS ────────────────────────────────────── */
/** Formata valor em BRL */
function formatBRL(val) {
  return `R$ ${val.toFixed(2).replace('.', ',')}`;
}

/** Salva carrinho no localStorage */
function saveCart() {
  localStorage.setItem('fornoNero_cart', JSON.stringify(cart));
}

/** Carrega carrinho do localStorage */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('fornoNero_cart')) || [];
  } catch {
    return [];
  }
}

/** Exibe um toast de notificação */
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/** Gera um ID único para o item no carrinho */
function cartItemId(itemId, tamanho, adicionais) {
  return `${itemId}_${tamanho}_${adicionais.join('|')}`;
}

/* ─── RENDERIZAÇÃO DO MENU ───────────────────────────── */
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const items = MENU_ITEMS.filter(item => {
    const matchCat  = currentFilter === 'todos' || item.cat === currentFilter;
    const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery) || item.desc.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="menu-empty">
        <div class="menu-empty-icon">🔍</div>
        <p>Nenhum item encontrado. Tente outra busca!</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(item => buildMenuCard(item)).join('');
}

/** Constrói o HTML de um card de produto */
function buildMenuCard(item) {
  const catLabel = { tradicionais: 'Tradicional', especiais: 'Especial', doces: 'Doce', bebidas: 'Bebida' };

  // Tamanhos
  const tamanhosHtml = item.naoTemTamanho ? '' : `
    <div>
      <label>Tamanho</label>
      <select id="tam_${item.id}" aria-label="Tamanho da pizza ${item.name}">
        ${Object.entries(item.prices).map(([k, v]) => `<option value="${k}">${k} – ${formatBRL(v)}</option>`).join('')}
      </select>
    </div>`;

  // Adicionais
  const adicionaisHtml = item.adicionais.length ? `
    <div>
      <label>Adicionais</label>
      <div class="adicionais">
        ${item.adicionais.map((a, i) => `
          <label class="adicional-item">
            <input type="checkbox" id="add_${item.id}_${i}" value="${a}" aria-label="${a}" />
            ${a}
          </label>`).join('')}
      </div>
    </div>` : '';

  // Preço base para bebidas
  const priceBase = item.naoTemTamanho ? Object.values(item.prices)[0] : Object.values(item.prices)[0];

  return `
    <article class="menu-card" data-id="${item.id}">
      <img class="menu-card-img" src="${item.img}" alt="${item.name}" loading="lazy" />
      <div class="menu-card-body">
        <span class="category-badge">${catLabel[item.cat] || item.cat}</span>
        <div class="menu-card-top">
          <h3 class="menu-card-name">${item.name}</h3>
          <span class="menu-card-price" id="price_${item.id}">${formatBRL(priceBase)}</span>
        </div>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="card-options">
          ${tamanhosHtml}
          ${adicionaisHtml}
        </div>
        <button
          class="btn-add-cart"
          onclick="addToCart(${item.id})"
          aria-label="Adicionar ${item.name} ao carrinho">
          + Adicionar ao Carrinho
        </button>
      </div>
    </article>`;
}

/** Atualiza o preço exibido quando o tamanho muda */
function updatePriceDisplay(itemId) {
  const item  = MENU_ITEMS.find(i => i.id === itemId);
  const select = document.getElementById(`tam_${itemId}`);
  if (!item || !select) return;
  const price = item.prices[select.value];
  document.getElementById(`price_${itemId}`).textContent = formatBRL(price);
}

/* ─── CARRINHO ───────────────────────────────────────── */
/** Adiciona um item ao carrinho */
function addToCart(itemId) {
  const item   = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  const tamSel  = document.getElementById(`tam_${itemId}`);
  const tamanho = tamSel ? tamSel.value : 'Un';
  const basePrice = item.prices[tamanho];

  // Coletar adicionais selecionados
  const selecionados = [];
  item.adicionais.forEach((a, i) => {
    const cb = document.getElementById(`add_${itemId}_${i}`);
    if (cb && cb.checked) selecionados.push(a);
  });

  // Calcular extras de preço
  const extraTotal = selecionados.reduce((sum, a) => {
    const match = a.match(/\+R\$\s*([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  const cid  = cartItemId(itemId, tamanho, selecionados);
  const existing = cart.find(c => c.cid === cid);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      cid,
      itemId,
      name: item.name,
      tamanho,
      adicionais: selecionados,
      unitPrice: basePrice + extraTotal,
      qty: 1,
    });
  }

  saveCart();
  renderCart();
  showToast(`✅ ${item.name} (${tamanho}) adicionada ao carrinho!`);
}

/** Atualiza a quantidade de um item no carrinho */
function updateQty(cid, delta) {
  const idx = cart.findIndex(c => c.cid === cid);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  renderCart();
}

/** Remove um item do carrinho */
function removeCartItem(cid) {
  cart = cart.filter(c => c.cid !== cid);
  saveCart();
  renderCart();
}

/** Retorna o total do carrinho */
function cartTotal() {
  return cart.reduce((sum, c) => sum + c.unitPrice * c.qty, 0);
}

/** Renderiza o carrinho no drawer */
function renderCart() {
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const countEl  = document.getElementById('cartCount');

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  countEl.textContent = totalItems;
  countEl.classList.toggle('visible', totalItems > 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Seu carrinho está vazio.<br />Escolha uma pizza deliciosa!</p>
      </div>`;
    footerEl.innerHTML = '';
    return;
  }

  // Items
  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item" data-cid="${c.cid}">
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-details">${c.tamanho}${c.adicionais.length ? ' • ' + c.adicionais.join(', ') : ''}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty('${c.cid}', -1)" aria-label="Diminuir quantidade">−</button>
          <span class="qty-value">${c.qty}</span>
          <button class="qty-btn" onclick="updateQty('${c.cid}', 1)" aria-label="Aumentar quantidade">+</button>
          <button class="btn-remove-item" onclick="removeCartItem('${c.cid}')" aria-label="Remover item">Remover</button>
        </div>
      </div>
      <span class="cart-item-price">${formatBRL(c.unitPrice * c.qty)}</span>
    </div>`).join('');

  // Footer com total
  footerEl.innerHTML = `
    <div class="cart-total-row">
      <span>Total do pedido</span>
      <strong>${formatBRL(cartTotal())}</strong>
    </div>
    <button class="btn-checkout" onclick="openCheckout()" aria-label="Finalizar pedido pelo WhatsApp">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.484 2 12.017c0 1.987.519 3.852 1.428 5.464L2 22l4.65-1.418A9.95 9.95 0 0012 22c5.522 0 10-4.483 10-10S17.521 2 12 2z"/></svg>
      Finalizar pelo WhatsApp
    </button>`;
}

/* ─── DRAWER TOGGLE ──────────────────────────────────── */
function toggleCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const open = drawer.classList.toggle('open');
  overlay.classList.toggle('visible', open);
  drawer.setAttribute('aria-hidden', !open);
}

/* ─── CHECKOUT MODAL ─────────────────────────────────── */
function openCheckout() {
  if (cart.length === 0) { showToast('Adicione itens ao carrinho primeiro!'); return; }
  const overlay = document.getElementById('checkoutOverlay');
  const total   = document.getElementById('modalTotal');
  total.innerHTML = `<span>Total</span><strong>${formatBRL(cartTotal())}</strong>`;
  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  // Fecha o drawer
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('visible');
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
}

/* ─── WHATSAPP MESSAGE ───────────────────────────────── */
/** Monta a mensagem formatada para o WhatsApp */
function buildWhatsAppMessage(name, address, payment, obs) {
  const lines = ['🍕 *Novo Pedido – Zap Pizza*', ''];

  lines.push('*📋 Itens do Pedido:*');
  cart.forEach((c, i) => {
    const adds = c.adicionais.length ? `\n   ➕ ${c.adicionais.join(', ')}` : '';
    lines.push(`${i + 1}. *${c.name}* (${c.tamanho}) × ${c.qty} = ${formatBRL(c.unitPrice * c.qty)}${adds}`);
  });

  lines.push('');
  lines.push(`💰 *Total: ${formatBRL(cartTotal())}*`);
  lines.push('');
  lines.push('*👤 Dados do Cliente:*');
  lines.push(`• Nome: ${name}`);
  lines.push(`• Endereço: ${address}`);
  lines.push(`• Pagamento: ${payment}`);
  if (obs.trim()) lines.push(`• Obs: ${obs}`);

  return lines.join('\n');
}

/** Valida e dispara o link do WhatsApp */
function finalizeOrder() {
  const name    = document.getElementById('clientName').value.trim();
  const address = document.getElementById('clientAddress').value.trim();
  const payment = document.getElementById('paymentMethod').value;
  const obs     = document.getElementById('obsField').value.trim();

  if (!name)    { showFieldError('clientName', 'Por favor, informe seu nome.'); return; }
  if (!address) { showFieldError('clientAddress', 'Por favor, informe o endereço de entrega.'); return; }

  const message = buildWhatsAppMessage(name, address, payment, obs);
  const url     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  // Limpar carrinho após envio
  cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  showToast('🎉 Pedido enviado! Aguarde a confirmação pelo WhatsApp.');
}

/** Destaca campo com erro */
function showFieldError(fieldId, msg) {
  const el = document.getElementById(fieldId);
  el.style.borderColor = '#e8460a';
  el.focus();
  showToast(`⚠️ ${msg}`);
  el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
}

/* ─── FILTROS ────────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.dataset.cat;
      renderMenu();
    });
  });
}

/** Inicia campo de busca */
function initSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    renderMenu();
  });
}

/* ─── HEADER SCROLL ──────────────────────────────────── */
function initScrollHeader() {
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── MOBILE MENU ────────────────────────────────────── */
function toggleMobileMenu() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  const open = nav.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  nav.setAttribute('aria-hidden', !open);
}

function closeMobileMenu() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  nav.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-hidden', 'true');
}

/* ─── SCROLL TO MENU ─────────────────────────────────── */
function scrollToMenu() {
  document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });
}

/* ─── ATUALIZAÇÃO DE PREÇOS EM TEMPO REAL ────────────── */
/** Delegação de eventos para selects de tamanho */
function initPriceUpdates() {
  document.getElementById('menuGrid').addEventListener('change', e => {
    const match = e.target.id.match(/^tam_(\d+)$/);
    if (match) updatePriceDisplay(Number(match[1]));
  });
}

/* ─── FECHAR MODAL AO CLICAR FORA ────────────────────── */
function initModalClose() {
  document.getElementById('checkoutOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCheckout();
  });
}

/* ─── ANIMAÇÃO DE ENTRADA EM SCROLL ──────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.diff-card, .review-card, .sobre-img, .sobre-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

  // Adiciona classe visible quando IntersectionObserver detecta
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `.diff-card.visible, .review-card.visible, .sobre-img.visible, .sobre-text.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(styleSheet);
}

/* ─── INICIALIZAÇÃO ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderCart();
  initFilters();
  initSearch();
  initScrollHeader();
  initPriceUpdates();
  initModalClose();
  initScrollAnimations();
});
