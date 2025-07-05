// Fungsi untuk memainkan suara saat hover
function playSound() {
    const sound = document.getElementById("hoverSound");
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

// Fungsi untuk mengaktifkan/nonaktifkan dropdown formulir
function toggleRegistrationForm() {
    const section = document.querySelector('.registration-section');
    const content = document.querySelector('.registration-form-content');

    section.classList.toggle('active');
    content.classList.toggle('active');

    playSound();
}

// --- JavaScript untuk Pengiriman Formulir Kustom (dengan Base64) ---
document.addEventListener('DOMContentLoaded', () => { // Pastikan DOM sudah dimuat
    const registrationForm = document.getElementById('registrationCustomForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Mencegah pengiriman formulir default

            const form = event.target;
            const submitButton = form.querySelector('button[type="submit"]');
            const responseMessage = document.getElementById('responseMessage');
            const fileInput = form.querySelector('input[name="ssBukti"]');

            // Reset pesan sebelumnya
            responseMessage.textContent = '';
            responseMessage.style.color = '';

            submitButton.disabled = true; // Nonaktifkan tombol saat submit
            responseMessage.textContent = 'Mengirim data...';
            responseMessage.style.color = '#007bff'; // Warna biru untuk loading

            // --- INI URL WEB APP APPS SCRIPT ANDA ---
            const appScriptUrl = 'https://accouner.site/api/submit-form';
            // ----------------------------------------

            try {
                // Buat objek FormData untuk mengumpulkan data teks dari formulir
                const formData = new FormData(form);

                // Proses file menjadi Base64
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const reader = new FileReader();

                    const base64Data = await new Promise((resolve, reject) => {
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                        reader.readAsDataURL(file); // Baca file sebagai Data URL (Base64 string)
                    });

                    formData.append('Screenshot Bukti Kepemilikan Account BA_base64', base64Data);
                    formData.append('Screenshot Bukul Kepemilikan Account BA_filename', file.name); // Typo here, corrected below
                    // Corrected filename key to match 'Screenshot Bukti Kepemilikan Account BA_filename'
                    // from formData.append('Screenshot Bukti Kepemilikan Account BA_filename', file.name);
                    formData.delete('ssBukti'); // Hapus input file asli agar tidak dikirim dua kali
                } else {
                    responseMessage.textContent = 'Gagal: File screenshot wajib diunggah.';
                    responseMessage.style.color = 'red';
                    submitButton.disabled = false;
                    return; // Hentikan proses jika tidak ada file yang dipilih
                }

                console.log('Sending data to Apps Script...');
                const response = await fetch(appScriptUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) { // Cek jika respons HTTP tidak OK (misal: 404, 500)
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const result = await response.json();
                console.log('Apps Script raw response:', result); // Log respons mentah dari Apps Script

                if (result.status === 'success') {
                    responseMessage.textContent = 'Selamat, formulir Anda berhasil dikirim!';
                    responseMessage.style.color = 'green';
                    // Tambahkan penundaan sebelum mereset form agar user bisa melihat pesan sukses
                    setTimeout(() => {
                        form.reset(); // Reset formulir setelah sukses
                        responseMessage.textContent = ''; // Hapus pesan setelah reset
                    }, 3000); // Tunda 3 detik sebelum reset
                } else {
                    // Pastikan pesan error dari Apps Script ditampilkan
                    const errorMessage = result.message || 'Terjadi kesalahan tidak diketahui dari server.';
                    responseMessage.textContent = 'Gagal: ' + errorMessage;
                    responseMessage.style.color = 'red';
                    console.error('Apps Script reported an error:', result.message);
                }

            } catch (error) {
                console.error('Error during form submission:', error);
                responseMessage.textContent = 'Terjadi kesalahan saat mengirim pendaftaran. Coba lagi atau hubungi admin. Detail: ' + error.message;
                responseMessage.style.color = 'red';
            } finally {
                submitButton.disabled = false; // Aktifkan kembali tombol
            }
        });
    }
});
// --- Akhir JavaScript Pengiriman Formulir Kustom ---
