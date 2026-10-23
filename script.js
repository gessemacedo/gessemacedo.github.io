(function () {
    'use strict';

    // Anos de experiência calculados a partir das datas reais
    function yearsSince(year, month) {
        const now = new Date();
        let y = now.getFullYear() - year;
        if (now.getMonth() + 1 < month) y--;
        return y;
    }
    const yearsIT = yearsSince(2018, 6);  // Suporte desde jun/2018
    const yearsDev = yearsSince(2019, 5); // Analista de Sistemas desde mai/2019
    document.querySelectorAll('.years-it').forEach(el => { el.textContent = yearsIT; });
    document.querySelectorAll('.years-dev').forEach(el => { el.textContent = yearsDev; });
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Animação ao rolar (sem JS ou com movimento reduzido, o conteúdo fica visível)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeEls = document.querySelectorAll('.fade-in');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        fadeEls.forEach(el => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        fadeEls.forEach(el => observer.observe(el));
    }

    // Menu mobile
    const menu = document.getElementById('navMenu');
    const openBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-menu');

    function setMenu(open) {
        menu.classList.toggle('active', open);
        openBtn.setAttribute('aria-expanded', String(open));
        openBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    openBtn.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
    closeBtn.addEventListener('click', () => { setMenu(false); openBtn.focus(); });
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !openBtn.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) { setMenu(false); openBtn.focus(); }
    });

    // Rolagem suave que atualiza a URL e move o foco
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            const target = id.length > 1 && document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            setMenu(false);
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            history.pushState(null, '', id);
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    // Esconde a navegação ao rolar para baixo (passivo + requestAnimationFrame)
    const nav = document.querySelector('nav');
    let lastScroll = 0;
    let ticking = false;
    function onScroll() {
        const current = window.scrollY;
        if (current <= 0) {
            nav.classList.remove('hidden');
        } else if (current > lastScroll && current > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = current;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    // Mantém a navegação visível quando algo dentro dela recebe foco
    nav.addEventListener('focusin', () => nav.classList.remove('hidden'));
})();
