document.addEventListener('DOMContentLoaded', function() {
    // Ambil semua elemen dengan class 'category-title'
    const categoryTitles = document.querySelectorAll('.category-title');

    // Iterasi setiap 'category-title'
    categoryTitles.forEach(title => {
        // Tambahkan event listener untuk klik pada setiap judul kategori
        title.addEventListener('click', function() {
            // Dapatkan elemen 'items' yang merupakan sibling berikutnya dari 'category-title' yang diklik
            const items = this.nextElementSibling;
            // Dapatkan elemen 'arrow' di dalam 'category-title'
            const arrow = this.querySelector('.arrow');

            // Toggle class 'open' pada elemen 'items' untuk menampilkan/menyembunyikan konten
            items.classList.toggle('open');
            // Toggle class 'active' pada 'category-title' untuk memutar panah
            this.classList.toggle('active');
        });
    });
});
