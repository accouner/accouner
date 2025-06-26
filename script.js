document.addEventListener('DOMContentLoaded', function() {
    const categoryTitles = document.querySelectorAll('.category-title');

    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            const items = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            if (items.classList.contains('open')) {
                items.classList.remove('open');
                this.classList.remove('active');
            } else {
                // Close other open categories
                document.querySelectorAll('.items.open').forEach(openItem => {
                    openItem.classList.remove('open');
                    openItem.previousElementSibling.classList.remove('active');
                });
                items.classList.add('open');
                this.classList.add('active');
            }
        });
    });
});
