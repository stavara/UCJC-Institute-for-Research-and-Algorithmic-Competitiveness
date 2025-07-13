document.addEventListener('DOMContentLoaded', () => {
    const globalInfo   = document.getElementById('more-info');
    const cards        = Array.from(document.querySelectorAll('#research .card'));
    const textFiles    = [
        'texts/grafos.txt',
        'texts/cuantica.txt',
        'texts/electronica.txt'
    ];
    let currentIdx     = null;
    const isMobile     = () => window.innerWidth <= 768;

    // 1) Referencia al h1 principal y almacena su texto original
    const mainTitle       = document.querySelector('.hero h1');
    const originalTitle   = mainTitle.textContent;

    document.querySelectorAll('#research .card .btn').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const idx  = cards.indexOf(card);
            if (idx < 0) return;

            // 2) Si ya está activo y es la misma tarjeta, ciérralo y restaura título
            if (globalInfo.classList.contains('active') && currentIdx === idx) {
                globalInfo.classList.remove('active');
                mainTitle.textContent = originalTitle;
                currentIdx = null;
                return;
            }
            globalInfo.classList.remove('active');

            // Extrae título de la tarjeta
            const cardTitle = card.querySelector('.card-content h3').textContent;
            // 3) Asigna ese título al h1 principal
            mainTitle.textContent = cardTitle;

            fetch(textFiles[idx])
                .then(res => {
                    if (!res.ok) throw new Error('Error cargando texto');
                    return res.text();
                })
                .then(text => {
                    // Pon el título en el detalle también
                    const headingEl = globalInfo.querySelector('h4');
                    if (headingEl) {
                        headingEl.textContent = cardTitle;
                    }

                    // Convierte Markdown a HTML
                    const mdContainer = globalInfo.querySelector('.markdown-container');
                    if (mdContainer) {
                        mdContainer.innerHTML = marked.parse(text);
                    }

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
                    if (mdContainer) mdContainer.textContent = 'No se pudo cargar la información.';
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
