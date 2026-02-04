const links = document.querySelectorAll('#sidebar .nav-link');
const panels = document.querySelectorAll('.panel'); // Panels section below

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const panelName = link.dataset.panel;
        panels.forEach(p => p.style.display = 'none');
        document.getElementById(`panel-${panelName}`).style.display = 'block';
        document.getElementById('panelTitle').textContent = panelName.charAt(0).toUpperCase() + panelName.slice(1);
    });
});
