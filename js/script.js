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

            // Si clicas de nuevo en la misma, ciérralo
            if (globalInfo.classList.contains('active') && currentIdx === idx) {
                globalInfo.classList.remove('active');
                currentIdx = null;
                return;
            }

            // Cierra cualquier otro abierto
            globalInfo.classList.remove('active');

            // Carga el .txt correspondiente
            fetch(textFiles[idx])
                .then(res => {
                    if (!res.ok) throw new Error('Error cargando texto');
                    return res.text();
                })
                .then(text => {
                    const heading = card.querySelector('.card-content h3')?.textContent || '';
                    globalInfo.querySelector('h4').textContent = heading;
                    globalInfo.querySelector('p').textContent  = text;

                    // En móvil, lo insertamos justo después de la tarjeta
                    if (isMobile()) {
                        card.insertAdjacentElement('afterend', globalInfo);
                    } else {
                        // En desktop, lo dejamos bajo todo (#research)
                        document.querySelector('#research').appendChild(globalInfo);
                    }

                    globalInfo.classList.add('active');
                    currentIdx = idx;
                })
                .catch(err => {
                    console.error(err);
                    globalInfo.querySelector('h4').textContent = 'Error';
                    globalInfo.querySelector('p').textContent  = 'No se pudo cargar la información.';
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

    // Recoloca o cierra al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (!isMobile() && currentIdx !== null) {
            // Si pasamos a desktop y hay algo abierto, reubica al final
            document.querySelector('#research').appendChild(globalInfo);
        }
    });
});
