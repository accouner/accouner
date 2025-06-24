document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');
    const noResultsMessage = document.getElementById('noResults');

    // Ganti dengan URL Web App Apps Script Anda!
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4MBzMecp1_cGAM5L16OqHM-eI-zV4dWynxJGF4X1hmvLoeKiB_KeC7972ENwtTcwP/exec';

    const performSearch = async () => {
        const query = searchInput.value.trim();

        // Sembunyikan pesan "Tidak Ditemukan" dan hasil sebelumnya
        resultsContainer.innerHTML = '';
        noResultsMessage.style.display = 'none';

        if (query.length === 0) {
            alert('Mohon masukkan kata kunci pencarian.');
            return;
        }

        loadingIndicator.classList.add('show'); // Tampilkan loading indicator

        try {
            // Menggunakan Fetch API untuk mengirim permintaan POST ke Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors', // Penting untuk CORS saat berkomunikasi dengan Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
            });

            const data = await response.json();

            loadingIndicator.classList.remove('show'); // Sembunyikan loading indicator

            if (data.results && data.results.length > 0) {
                // Tampilkan hasil
                data.results.forEach(pedagang => {
                    const card = createPedagangCard(pedagang);
                    resultsContainer.appendChild(card);
                });
            } else {
                // Tampilkan pesan tidak ditemukan
                noResultsMessage.style.display = 'block';
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            loadingIndicator.classList.remove('show'); // Sembunyikan loading indicator
            noResultsMessage.textContent = 'Terjadi kesalahan saat mencari. Mohon coba lagi nanti.';
            noResultsMessage.style.display = 'block';
        }
    };

    // Fungsi untuk membuat kartu pedagang secara dinamis
    const createPedagangCard = (pedagang) => {
        const card = document.createElement('div');
        card.classList.add('pedagang-card');

        let verifiedHtml = '';
        if (pedagang.statusVerified) {
            verifiedHtml = `<span class="verified-icon"><i class="fas fa-check-circle"></i> Verified</span>`;
        }

        let whatsappButton = '';
        if (pedagang.nomorWhatsApp) {
            const waLink = `https://wa.me/${pedagang.nomorWhatsApp.replace(/\+/g, '')}`; // Remove '+' for wa.me
            whatsappButton = `<a href="${waLink}" target="_blank" class="btn-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>`;
        }

        let telegramButton = '';
        if (pedagang.nomorTelegram || pedagang.usernameTelegram) {
            const telegramIdentifier = pedagang.usernameTelegram || pedagang.nomorTelegram;
            const tgLink = `https://t.me/${telegramIdentifier.replace(/\+/g, '')}`; // Remove '+' for t.me
            telegramButton = `<a href="${tgLink}" target="_blank" class="btn-telegram"><i class="fab fa-telegram-plane"></i> Telegram</a>`;
        }

        // Untuk fitur info: Kita akan menggunakan modal/pop-up
        let infoModalHtml = '';
        if (pedagang.informasi) {
            infoModalHtml = `
                <div id="infoModal_${pedagang.namaPedagang.replace(/\s/g, '_')}" class="modal">
                    <div class="modal-content">
                        <span class="close-button" data-modal-id="infoModal_${pedagang.namaPedagang.replace(/\s/g, '_')}">&times;</span>
                        <h2>Informasi Pedagang</h2>
                        <p>${pedagang.informasi}</p>
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <h2>${pedagang.namaPedagang} ${verifiedHtml}</h2>
                <i class="fas fa-info-circle info-icon" data-info-id="${pedagang.namaPedagang.replace(/\s/g, '_')}"></i>
            </div>
            <div class="card-actions">
                <a href="${pedagang.linkAkunTwitter}" target="_blank" class="btn-twitter"><i class="fab fa-twitter"></i> Kunjungi Profil</a>
                ${whatsappButton}
                ${telegramButton}
            </div>
            ${infoModalHtml}
        `;

        // Attach event listener for info icon if information exists
        if (pedagang.informasi) {
            const infoIcon = card.querySelector('.info-icon');
            infoIcon.addEventListener('click', () => {
                const modalId = infoIcon.dataset.infoId;
                document.getElementById(`infoModal_${modalId}`).style.display = 'flex';
            });
        }

        return card;
    };

    // Event listener untuk menutup modal info
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-button')) {
            const modalId = event.target.dataset.modalId;
            document.getElementById(modalId).style.display = 'none';
        }
        if (event.target.classList.contains('modal')) { // Click outside the modal content
            event.target.style.display = 'none';
        }
    });


    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
