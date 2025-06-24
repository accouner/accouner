// ... (kode awal script.js, termasuk bagian const searchInput, searchButton, dll.) ...

// !!! SANGAT PENTING: PASTIKAN URL INI ADALAH URL WEB APP Apps Script TERBARU DARI DEPLOYMENT 'NEW DEPLOYMENT' !!!
// COPY PASTE LANGSUNG DARI WINDOW DEPLOYMENT APPS SCRIPT ANDA DI LANGKAH SEBELUMNYA
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4MBzMecp1_cGAM5L16OqHM-eI-zV4dWynxJGF4X1hmvLoeKiB_KeC7972ENwtTcwP/exec'; // GANTI DENGAN URL TERBARU ANDA DI SINI

console.log("Website Dimuat.");
console.log("SCRIPT_URL yang akan digunakan:", SCRIPT_URL); // Log URL yang digunakan

const performSearch = async () => {
    const query = searchInput.value.trim();
    console.log("Pencarian dimulai untuk query:", query);

    // Sembunyikan hasil dan pesan sebelumnya
    resultsContainer.innerHTML = '';
    noResultsMessage.style.display = 'none';

    if (query.length === 0) {
        alert('Mohon masukkan kata kunci pencarian.');
        console.log("Query kosong, menghentikan pencarian.");
        return;
    }

    loadingIndicator.classList.add('show'); // Tampilkan loading indicator
    console.log("Indikator loading ditampilkan.");

    try {
        // Mengubah metode ke GET dan menambahkan query ke URL sebagai parameter
        // encodeURIComponent digunakan untuk memastikan query aman di URL (misal: spasi)
        const urlWithQuery = `${SCRIPT_URL}?query=${encodeURIComponent(query)}`;
        console.log("Mengirim permintaan GET ke URL:", urlWithQuery);

        const response = await fetch(urlWithQuery, {
            method: 'GET', // Ubah metode menjadi GET
            mode: 'cors'
            // Header 'Content-Type' dan 'body' tidak diperlukan untuk GET sederhana
        });

        console.log("Permintaan Fetch selesai. Status respons HTTP:", response.status);
        if (!response.ok) {
            // Jika status bukan 2xx (misal: 404, 500, dll.), berarti ada masalah HTTP
            const errorText = await response.text();
            console.error("Kesalahan HTTP! Status:", response.status, "Body Respons:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data diterima dari Apps Script (parsed JSON):", data);

        loadingIndicator.classList.remove('show');

        if (data.results && data.results.length > 0) {
            data.results.forEach(pedagang => {
                const card = createPedagangCard(pedagang);
                resultsContainer.appendChild(card);
            });
            console.log("Kartu pedagang berhasil dibuat dan ditampilkan.");
        } else {
            noResultsMessage.style.display = 'block';
            console.log("Tidak ada hasil ditemukan.");
        }

    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data:', error);
        loadingIndicator.classList.remove('show');
        noResultsMessage.textContent = 'Terjadi kesalahan saat mencari. Mohon coba lagi nanti. Detail: ' + error.message;
        noResultsMessage.style.display = 'block';
    }
};

// ... (sisa kode script.js, termasuk fungsi createPedagangCard dan event listeners) ...
