// --- Fortnite Page Specific Logic ---
const VBUCKS_RATE = 10; // 1 MXN = 10 Pavos

function openDetailsModal(title, img, desc, link, mode, cost, region, currentPlayers, maxPlayers) {
    const detailsModal = document.getElementById('details-modal');
    document.getElementById('details-modal-title').textContent = title;
    document.getElementById('details-modal-img').src = img;
    document.getElementById('details-modal-desc').textContent = desc;
    document.getElementById('details-modal-link').href = link;
    document.getElementById('details-modal-mode').textContent = mode;
    document.getElementById('details-modal-cost').textContent = cost;
    document.getElementById('details-modal-region').textContent = region;
    
    const playersEl = document.getElementById('details-modal-players');
    playersEl.textContent = maxPlayers > 0 ? `${currentPlayers} / ${maxPlayers}` : 'N/A';
    
    detailsModal.classList.remove('hidden');
}

function closeDetailsModal() {
    document.getElementById('details-modal').classList.add('hidden');
}

function openModal() {
    document.getElementById('modal-form-content').classList.remove('hidden');
    document.getElementById('modal-voucher-content').classList.add('hidden');
    updateModalLogic();
    document.getElementById('create-modal').classList.remove('hidden');
}

function openModalWithMap(teamSize, mode) {
    const teamSizeSelect = document.getElementById('team-size');
    const duelModeSelect = document.getElementById('duel-mode');
    teamSizeSelect.value = teamSize;
    updateModalLogic();
    duelModeSelect.value = mode;
    openModal();
}

function closeModal() {
    document.getElementById('create-modal').classList.add('hidden');
}

function filterDuelModes() {
    const teamSizeSelect = document.getElementById('team-size');
    const duelModeSelect = document.getElementById('duel-mode');
    const selectedTeamSize = teamSizeSelect.value;
    const allOptions = duelModeSelect.querySelectorAll('option');
    
    allOptions.forEach(option => {
        option.style.display = option.dataset.teamSize === selectedTeamSize ? 'block' : 'none';
    });

    if (duelModeSelect.querySelector('option[style="display: block;"]')) {
        if (duelModeSelect.options[duelModeSelect.selectedIndex].style.display === 'none') {
            duelModeSelect.value = duelModeSelect.querySelector('option[style="display: block;"]').value;
        }
    }
}

function updatePaymentSummary() {
    const teamSize = parseInt(document.getElementById('team-size').value.split('v')[0]);
    const totalPlayers = teamSize * 2;
    const bet = parseFloat(document.getElementById('bet-amount').value) || 0;
    const prizeType = document.getElementById('prize-type').value;
    const paymentOption = document.getElementById('payment-option').value;

    const totalPot = bet * totalPlayers;
    let commission = 0;
    let finalPrize = 0;

    if (prizeType === 'cash') {
        commission = totalPot * 0.10;
        finalPrize = totalPot - commission;
        document.getElementById('final-prize').textContent = `$${finalPrize.toFixed(2)} MXN`;
        document.getElementById('commission-fee').textContent = `-$${commission.toFixed(2)} MXN`;
    } else {
        const sideBet = bet * teamSize;
        if (sideBet >= 45) {
            // Cada 45 MXN por lado = 1,000 Pavos
            const multiplier = Math.floor(sideBet / 45);
            document.getElementById('final-prize').textContent = `${(1000 * multiplier).toLocaleString()} Pavos`;
        } else {
            document.getElementById('final-prize').textContent = `Mínimo $45 MXN por lado`;
        }
        document.getElementById('commission-fee').textContent = "$0.00 MXN";
    }
    
    document.getElementById('total-pot').textContent = `$${totalPot.toFixed(2)} MXN`;

    let payment = (teamSize > 1 && paymentOption === 'team') ? bet * teamSize : bet;
    document.getElementById('your-payment').textContent = `$${payment.toFixed(2)} MXN`;
}

function updateModalLogic() {
    const teamSize = document.getElementById('team-size').value;
    const teamOptions = document.getElementById('team-options');
    teamOptions.classList.toggle('hidden', teamSize === '1v1');
    filterDuelModes();
    updatePaymentSummary();
}

function generateVoucher() {
    const teamSize = document.getElementById('team-size').value;
    const mode = document.getElementById('duel-mode').value;
    const bet = parseFloat(document.getElementById('bet-amount').value) || 0;
    const prize = document.getElementById('final-prize').textContent;
    const visibilitySelect = document.getElementById('visibility');
    const visibility = visibilitySelect.options[visibilitySelect.selectedIndex].text;
    const teamNameInput = document.getElementById('team-name');
    const teamName = teamNameInput.value || `Equipo-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const isNegotiable = document.getElementById('negotiable').checked;

    document.getElementById('voucher-mode').textContent = `${teamSize.toUpperCase()} - ${mode}`;
    document.getElementById('voucher-bet').textContent = `$${bet.toFixed(2)} MXN (por jugador)`;
    document.getElementById('voucher-prize').textContent = prize;
    document.getElementById('voucher-visibility').textContent = visibility;
    document.getElementById('negotiable-badge').classList.toggle('hidden', !isNegotiable);
    
    const randomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    document.getElementById('voucher-code').textContent = `semicompañero${teamSize}-${teamName.replace(/\s+/g, '')}-${randomCode}`;

    document.getElementById('modal-form-content').classList.add('hidden');
    document.getElementById('modal-voucher-content').classList.remove('hidden');
}

// Event Listeners for Fortnite page
window.addEventListener('load', () => {
    const teamSizeSelect = document.getElementById('team-size');
    const betAmountInput = document.getElementById('bet-amount');
    const prizeTypeSelect = document.getElementById('prize-type');
    const paymentOptionSelect = document.getElementById('payment-option');
    const confirmBtn = document.getElementById('confirm-duel-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    if (teamSizeSelect) teamSizeSelect.addEventListener('change', updateModalLogic);
    if (betAmountInput) betAmountInput.addEventListener('input', updatePaymentSummary);
    if (prizeTypeSelect) prizeTypeSelect.addEventListener('change', updatePaymentSummary);
    if (paymentOptionSelect) paymentOptionSelect.addEventListener('change', updatePaymentSummary);
    if (confirmBtn) confirmBtn.addEventListener('click', generateVoucher);

    // Initial logic update
    if (teamSizeSelect) updateModalLogic();

    // Category Filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            categoryBtns.forEach(b => {
                b.classList.remove('nav-category-glow');
                b.classList.add('nav-category-glass');
                b.classList.remove('text-white');
                b.classList.add('text-gray-300');
            });
            btn.classList.add('nav-category-glow');
            btn.classList.remove('nav-category-glass');
            btn.classList.add('text-white');
            btn.classList.remove('text-gray-300');

            const sections = document.querySelectorAll('.tournament-section');
            sections.forEach(sec => {
                if (filter === 'todos') {
                    sec.style.display = 'block';
                } else {
                    sec.style.display = sec.dataset.category === filter ? 'block' : 'none';
                }
            });
        });
    });
});
