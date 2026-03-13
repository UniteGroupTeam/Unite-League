// --- Clash Royale Page Specific Logic ---
const PASS_ROYALE_MIN_POT = 80;

function openModal() {
    document.getElementById('modal-form-content').classList.remove('hidden');
    document.getElementById('modal-voucher-content').classList.add('hidden');
    updateModalLogic();
    document.getElementById('create-modal').classList.remove('hidden');
}

function openModalWithMode(teamSize) {
    document.getElementById('team-size').value = teamSize;
    updateModalLogic();
    openModal();
}

function closeModal() {
    document.getElementById('create-modal').classList.add('hidden');
}

function updatePaymentSummary() {
    const teamSizeVal = document.getElementById('team-size').value;
    const teamSize = parseInt(teamSizeVal[0]);
    const totalPlayers = teamSize * 2;
    const bet = parseFloat(document.getElementById('bet-amount').value) || 0;
    const prizeType = document.getElementById('prize-type').value;
    const paymentOption = document.getElementById('payment-option').value;
    const passWarning = document.getElementById('pass-warning');

    const totalPot = bet * totalPlayers;
    let commission = 0;
    let finalPrize = 0;

    if (passWarning) passWarning.classList.add('hidden');

    if (prizeType === 'cash') {
        commission = totalPot * 0.10;
        finalPrize = totalPot - commission;
        document.getElementById('final-prize').textContent = `$${finalPrize.toFixed(2)} MXN`;
        document.getElementById('commission-fee').textContent = `-$${commission.toFixed(2)} MXN`;
    } else {
        commission = 0;
        document.getElementById('commission-fee').textContent = "$0.00 MXN";
        if (totalPot >= PASS_ROYALE_MIN_POT) {
            document.getElementById('final-prize').textContent = "1x Pass Royale";
        } else {
            document.getElementById('final-prize').textContent = "$0.00 MXN (No alcanza)";
            if (passWarning) passWarning.classList.remove('hidden');
        }
    }
    
    document.getElementById('total-pot').textContent = `$${totalPot.toFixed(2)} MXN`;

    let payment = (teamSize > 1 && paymentOption === 'team') ? bet * teamSize : bet;
    document.getElementById('your-payment').textContent = `$${payment.toFixed(2)} MXN`;
}

function updateModalLogic() {
    const teamSize = document.getElementById('team-size').value;
    const prizeTypeSelect = document.getElementById('prize-type');
    const visibilitySelect = document.getElementById('visibility');
    const teamOptions = document.getElementById('team-options');

    if (teamSize === '1v1') {
        if (teamOptions) teamOptions.classList.add('hidden');
        prizeTypeSelect.options[1].disabled = false;
        visibilitySelect.options[0].text = "Público (Buscar Oponente)";
        visibilitySelect.options[1].text = "Contra Amigos";
    } else {
        if (teamOptions) teamOptions.classList.remove('hidden');
        prizeTypeSelect.options[1].disabled = true;
        if (prizeTypeSelect.value === 'pass') prizeTypeSelect.value = 'cash';
        visibilitySelect.options[0].text = "Buscar Dúo Oponente (Matchmaking)";
        visibilitySelect.options[1].text = "Juego Privado (Invitar 3 amigos)";
    }
    updatePaymentSummary();
}

function generateVoucher() {
    const teamSize = document.getElementById('team-size').value;
    const bestOfSelect = document.getElementById('best-of');
    const bestOf = bestOfSelect.options[bestOfSelect.selectedIndex].text;
    const bet = parseFloat(document.getElementById('bet-amount').value) || 0;
    const prize = document.getElementById('final-prize').textContent;
    const visibilitySelect = document.getElementById('visibility');
    const visibility = visibilitySelect.options[visibilitySelect.selectedIndex].text;
    const teamName = document.getElementById('team-name').value || `Equipo-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const isNegotiable = document.getElementById('negotiable').checked;

    document.getElementById('voucher-mode').textContent = `${teamSize.toUpperCase()} - Mejor de ${bestOf.split(' ')[0]}`;
    document.getElementById('voucher-bet').textContent = `$${bet.toFixed(2)} MXN (por jugador)`;
    document.getElementById('voucher-prize').textContent = prize;
    document.getElementById('voucher-visibility').textContent = visibility;
    document.getElementById('negotiable-badge').classList.toggle('hidden', !isNegotiable);
    
    const randomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    document.getElementById('voucher-code').textContent = `semicompañero${teamSize}-${teamName.replace(/\s+/g, '')}-${randomCode}`;

    const instr = document.getElementById('voucher-instructions');
    if (visibilitySelect.value === 'public') {
        instr.textContent = teamSize === '1v1' ? "¡Publica esta tarjeta en Discord para encontrar un oponente!" : "¡Publica esta tarjeta en Discord para encontrar un dúo oponente!";
    } else {
        instr.textContent = teamSize === '1v1' ? "¡Envía este código a tu amigo para el duelo!" : "¡Envía este código a tus 3 amigos para el juego privado!";
    }

    document.getElementById('modal-form-content').classList.add('hidden');
    document.getElementById('modal-voucher-content').classList.remove('hidden');
}

// Event Listeners for Clash Royale page
window.addEventListener('load', () => {
    const teamSizeSelect = document.getElementById('team-size');
    const betAmountInput = document.getElementById('bet-amount');
    const prizeTypeSelect = document.getElementById('prize-type');
    const paymentOptionSelect = document.getElementById('payment-option');
    const confirmBtn = document.getElementById('confirm-duel-btn');

    if (teamSizeSelect) teamSizeSelect.addEventListener('change', updateModalLogic);
    if (betAmountInput) betAmountInput.addEventListener('input', updatePaymentSummary);
    if (prizeTypeSelect) prizeTypeSelect.addEventListener('change', updatePaymentSummary);
    if (paymentOptionSelect) paymentOptionSelect.addEventListener('change', updatePaymentSummary);
    if (confirmBtn) confirmBtn.addEventListener('click', generateVoucher);

    if (teamSizeSelect) updateModalLogic();
});


