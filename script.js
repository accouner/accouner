document.addEventListener('DOMContentLoaded', () => {
    // Mendapatkan referensi ke elemen-elemen HTML berdasarkan ID mereka
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');
    const noResultsMessage = document.getElementById('noResults');

    // !!! SANGAT PENTING: PASTIKAN URL INI ADALAH URL WEB APP Apps Script TERBARU ANDA !!!
    // COPY PASTE LANGSUNG DARI WINDOW DEPLOYMENT APPS SCRIPT ANDA
    // Setelah Anda melakukan "New deployment" dan memilih "Anyone" access
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4MBzMecp1_cGAM5L16OqHM-eI-zV4dWynxJGF4X1hmvLoeKiB_KeC7972ENwtTcwP/exec'; // GANTI DENGAN URL APPS SCRIPT TERBARU ANDA DI SINI

    // Logging awal saat website dimuat
    console.log("Website Dimuat.");
    console.log("SCRIPT_URL yang akan digunakan:", SCRIPT_URL);

    // Logging untuk memeriksa apakah elemen HTML berhasil ditemukan
    console.log("Elemen searchInput ditemukan:", searchInput);
    console.log("Elemen searchButton ditemukan:", searchButton);
    console.log("Elemen loadingIndicator ditemukan:", loadingIndicator);
    console.log("Elemen resultsContainer ditemukan:", resultsContainer);
    console.log("Elemen noResultsMessage ditemukan:", noResultsMessage);


    // Fungsi utama untuk melakukan pencarian
    const performSearch = async () => {
        // alert("Fungsi performSearch terpanggil!"); // Alert ini bisa di-uncomment untuk debugging visual jika diperlukan
        console.log("Fungsi performSearch terpanggil!"); // Log ketika fungsi ini dipanggil

        const query = searchInput.value.trim();
        console.log("Pencarian dimulai untuk query:", query);

        // Bersihkan hasil sebelumnya dan sembunyikan pesan 'tidak ada hasil'
        resultsContainer.innerHTML = '';
        noResultsMessage.style.display = 'none';

        // Validasi jika query kosong
        if (query.length === 0) {
            alert('Mohon masukkan kata kunci pencarian.');
            console.log("Query kosong, menghentikan pencarian.");
            return; // Hentikan fungsi jika query kosong
        }

        // Tampilkan indikator loading
        if (loadingIndicator) { // Pastikan elemen ditemukan sebelum menambah kelas
            loadingIndicator.classList.add('show');
        }
        console.log("Indikator loading ditampilkan.");

        try {
            // Membangun URL untuk permintaan GET dengan parameter query
            const urlWithQuery = `${SCRIPT_URL}?query=${encodeURIComponent(query)}`;
            console.log("Mengirim permintaan GET ke URL:", urlWithQuery);

            // Melakukan permintaan fetch ke Apps Script
            const response = await fetch(urlWithQuery, {
                method: 'GET', // Menggunakan metode GET
                mode: 'cors'   // Penting untuk mengatasi CORS
                // Headers dan body tidak diperlukan untuk GET sederhana
            });

            console.log("Permintaan Fetch selesai. Status respons HTTP:", response.status);
            // Cek apakah respons sukses (status 200-299)
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Kesalahan HTTP! Status:", response.status, "Body Respons:", errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse respons sebagai JSON
            const data = await response.json();
            console.log("Data diterima dari Apps Script (parsed JSON):", data);

            // Sembunyikan indikator loading
            if (loadingIndicator) { // Pastikan elemen ditemukan sebelum menghapus kelas
                loadingIndicator.classList.remove('show');
            }

            // Tampilkan hasil pencarian
            if (data.results && data.results.length > 0) {
                data.results.forEach(pedagang => {
                    const card = createPedagangCard(pedagang);
                    resultsContainer.appendChild(card);
                });
                console.log("Kartu pedagang berhasil dibuat dan ditampilkan.");
            } else {
                // Tampilkan pesan jika tidak ada hasil
                if (noResultsMessage) { // Pastikan elemen ditemukan
                    noResultsMessage.style.display = 'block';
                }
                console.log("Tidak ada hasil ditemukan.");
            }

        } catch (error) {
            // Tangani error yang terjadi selama proses fetch
            console.error('Terjadi kesalahan saat mengambil data:', error);
            if (loadingIndicator) { // Pastikan elemen ditemukan
                loadingIndicator.classList.remove('show');
            }
            if (noResultsMessage) { // Pastikan elemen ditemukan
                noResultsMessage.textContent = 'Terjadi kesalahan saat mencari. Mohon coba lagi nanti. Detail: ' + error.message;
                noResultsMessage.style.display = 'block';
            }
        }
    };

    // Fungsi untuk membuat kartu pedagang (UI)
    const createPedagangCard = (pedagang) => {
        const card = document.createElement('div');
        card.classList.add('pedagang-card');

        // Tambahkan ikon verified jika statusVerified adalah true
        let verifiedHtml = '';
        if (pedagang.statusVerified) {
            verifiedHtml = `<span class="verified-icon"><i class="fas fa-check-circle"></i> Verified</span>`;
        }

        // Tombol WhatsApp
        let whatsappButton = '';
        if (pedagang.nomorWhatsApp) {
            // Pastikan nomor WhatsApp adalah string sebelum replace
            const waLink = `https://wa.me/${String(pedagang.nomorWhatsApp).replace(/\+/g, '')}`;
            whatsappButton = `<a href="${waLink}" target="_blank" class="btn-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>`;
        }

        // Tombol Telegram (bisa dari nomor atau username)
        let telegramButton = '';
        if (pedagang.nomorTelegram || pedagang.usernameTelegram) {
            // Pastikan identifier adalah string
            const telegramIdentifier = String(pedagang.usernameTelegram || pedagang.nomorTelegram).replace(/\+/g, '');
            const tgLink = `https://t.me/${telegramIdentifier}`;
            telegramButton = `<a href="${tgLink}" target="_blank" class="btn-telegram"><i class="fab fa-telegram-plane"></i> Telegram</a>`;
        }

        // Modal Informasi Tambahan
        let infoModalHtml = '';
        if (pedagang.informasi) {
            // Membuat ID yang aman untuk modal dari nama pedagang
            const modalIdSafe = pedagang.namaPedagang.replace(/[^a-zA-Z0-9]/g, '_'); // Ganti karakter non-alphanumerik dengan underscore
            infoModalHtml = `
                <div id="infoModal_${modalIdSafe}" class="modal">
                    <div class="modal-content">
                        <span class="close-button" data-modal-id="infoModal_${modalIdSafe}">&times;</span>
                        <h2>Informasi Pedagang</h2>
                        <p>${pedagang.informasi}</p>
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <h2>${pedagang.namaPedagang} ${verifiedHtml}</h2>
                ${pedagang.informasi ? `<i class="fas fa-info-circle info-icon" data-info-id="${pedagang.namaPedagang.replace(/[^a-zA-Z0-9]/g, '_')}"></i>` : ''}
            </div>
            <div class="card-actions">
                <a href="${pedagang.linkAkunTwitter}" target="_blank" class="btn-twitter"><i class="fab fa-twitter"></i> Kunjungi Profil</a>
                ${whatsappButton}
                ${telegramButton}
            </div>
            ${infoModalHtml}
        `;

        // Menambahkan event listener untuk ikon info jika ada informasi tambahan
        if (pedagang.informasi) {
            // Gunakan setTimeout untuk memastikan elemen sudah ada di DOM sebelum mencari
            setTimeout(() => {
                const infoIcon = card.querySelector('.info-icon');
                if (infoIcon) {
                    infoIcon.addEventListener('click', () => {
                        const modalId = infoIcon.dataset.infoId;
                        const modalElement = document.getElementById(`infoModal_${modalId}`);
                        if (modalElement) {
                            modalElement.style.display = 'flex';
                        }
                    });
                }
            }, 0); // Eksekusi setelah DOM di-render
        }

        return card;
    };


    // --- Event Listeners untuk interaksi pengguna ---

    // Event listener untuk tombol pencarian
    // Hanya tambahkan listener jika elemen tombol ditemukan
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            // alert("Tombol Cari Ditekan!"); // Alert ini bisa di-uncomment untuk debugging visual jika diperlukan
            console.log("Tombol Cari Ditekan."); // Log saat tombol diklik
            performSearch(); // Panggil fungsi pencarian
        });
    } else {
        // Pesan error jika tombol pencarian tidak ditemukan
        console.error("Elemen tombol pencarian dengan ID 'searchButton' tidak ditemukan di HTML!");
    }

    // Event listener untuk input pencarian (saat tombol Enter ditekan)
    // Hanya tambahkan listener jika elemen input ditemukan
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // alert("Tombol Enter Ditekan di Input Pencarian!"); // Alert ini bisa di-uncomment
                console.log("Tombol Enter Ditekan di Input Pencarian."); // Log saat Enter ditekan
                performSearch(); // Panggil fungsi pencarian
            }
        });
    } else {
        // Pesan error jika input pencarian tidak ditemukan
        console.error("Elemen input pencarian dengan ID 'searchInput' tidak ditemukan di HTML!");
    }


    // Event listener untuk tombol tutup modal dan klik di luar modal
    document.addEventListener('click', (event) => {
        // Jika elemen yang diklik memiliki kelas 'close-button'
        if (event.target.classList.contains('close-button')) {
            const modalId = event.target.dataset.modalId;
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                modalElement.style.display = 'none'; // Sembunyikan modal
            }
        }
        // Jika elemen yang diklik adalah modal itu sendiri (klik di luar konten modal)
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none'; // Sembunyikan modal
        }
    });

});
