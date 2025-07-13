document.addEventListener('DOMContentLoaded', () => {
    const globalInfo = document.getElementById('more-info');
    const cards = Array.from(document.querySelectorAll('#research .card'));
    const textFiles = [
        'texts/grafos.txt',
        'texts/cuantica.txt',
        'texts/electronica.txt'
    ];
    let currentIdx = null;
    const isMobile = () => window.innerWidth <= 768;

    document.querySelectorAll('#research .card .btn').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const idx = cards.indexOf(card);
            if (idx < 0) return;

            // Toggle mismo
            if (globalInfo.classList.contains('active') && currentIdx === idx) {
                globalInfo.classList.remove('active');
                currentIdx = null;
                return;
            }
            globalInfo.classList.remove('active');

            fetch(textFiles[idx])
                .then(res => {
                    if (!res.ok) throw new Error('Error cargando texto');
                    return res.text();
                })
                .then(text => {
                    // Sólo convertimos Markdown a HTML
                    const mdContainer = globalInfo.querySelector('.markdown-container');
                    mdContainer.innerHTML = marked.parse(text);

                    // Inserta en móvil justo tras la card, en desktop al final
                    if (isMobile()) {
                        card.insertAdjacentElement('afterend', globalInfo);
                    } else {
                        document.querySelector('#research').appendChild(globalInfo);
                    }

                    globalInfo.classList.add('active');
                    currentIdx = idx;
                })
                .catch(err => {
                    console.error(err);
                    const mdContainer = globalInfo.querySelector('.markdown-container');
                    mdContainer.textContent = 'No se pudo cargar la información.';
                    if (isMobile()) {
                        card.insertAdjacentElement('afterend', globalInfo);
                    } else {
                        document.querySelector('#research').appendChild(globalInfo);
                    }
                    globalInfo.classList.add('active');
                    currentIdx = idx;
                });
        });
    });

    window.addEventListener('resize', () => {
        if (!isMobile() && currentIdx !== null) {
            document.querySelector('#research').appendChild(globalInfo);
        }
    });
});
