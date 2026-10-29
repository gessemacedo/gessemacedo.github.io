(function () {
    'use strict';

    // Anos de experiência calculados a partir das datas reais
    function yearsSince(year, month) {
        const now = new Date();
        let y = now.getFullYear() - year;
        if (now.getMonth() + 1 < month) y--;
        return y;
    }
    function updateYears() {
        const yearsIT = yearsSince(2018, 6);  // Suporte desde jun/2018
        const yearsDev = yearsSince(2019, 5); // Analista de Sistemas desde mai/2019
        document.querySelectorAll('.years-it').forEach(el => { el.textContent = yearsIT; });
        document.querySelectorAll('.years-dev').forEach(el => { el.textContent = yearsDev; });
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
    updateYears();

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
        openBtn.setAttribute('aria-label', open ? t('closeMenu') : t('openMenu'));
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

    // ---------- Idioma (PT/EN) ----------
    const I18N = window.I18N || { en: {}, ui: { pt: {}, en: {} } };
    const i18nEls = document.querySelectorAll('[data-i18n]');
    const ptText = {};
    i18nEls.forEach(el => { ptText[el.dataset.i18n] = el.innerHTML; });
    let lang = 'pt';
    function t(key) { return (I18N.ui[lang] && I18N.ui[lang][key]) || I18N.ui.pt[key] || ''; }
    function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* modo privado */ } }
    function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

    const langBtn = document.getElementById('langToggle');
    function applyLang(next) {
        lang = next === 'en' ? 'en' : 'pt';
        document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
        i18nEls.forEach(el => {
            const key = el.dataset.i18n;
            const html = lang === 'en' ? I18N.en[key] : ptText[key];
            if (html !== undefined) el.innerHTML = html;
        });
        document.title = t('title');
        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute('content', t('description'));
        nav.setAttribute('aria-label', t('nav'));
        openBtn.setAttribute('aria-label', menu.classList.contains('active') ? t('closeMenu') : t('openMenu'));
        closeBtn.setAttribute('aria-label', t('closeMenu'));
        langBtn.textContent = t('langBtn');
        langBtn.setAttribute('lang', t('langAttr'));
        langBtn.setAttribute('aria-label', t('langLabel'));
        const cv = document.getElementById('cvLink');
        if (cv) cv.setAttribute('href', t('cv'));
        updateYears();
        updateThemeButton();
        renderProjects();
        renderPosts();
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }
    langBtn.addEventListener('click', () => {
        const next = lang === 'en' ? 'pt' : 'en';
        store('lang', next);
        applyLang(next);
    });

    // ---------- Tema claro/escuro ----------
    const themeBtn = document.getElementById('themeToggle');
    const root = document.documentElement;
    function updateThemeButton() {
        const dark = root.dataset.theme === 'dark';
        themeBtn.setAttribute('aria-pressed', String(dark));
        themeBtn.setAttribute('aria-label', dark ? t('themeToLight') : t('themeToDark'));
        themeBtn.querySelector('.theme-icon').textContent = dark ? '☀️' : '🌙';
    }
    themeBtn.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        store('theme', root.dataset.theme);
        updateThemeButton();
    });
    // Segue o sistema enquanto o usuário não escolher manualmente
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = (e) => { if (!read('theme')) { root.dataset.theme = e.matches ? 'dark' : 'light'; updateThemeButton(); } };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);

    // ---------- Projetos com filtro ----------
    const projectList = document.getElementById('projectList');
    const filters = document.getElementById('projectFilters');
    const projectStatus = document.getElementById('projectStatus');
    const projects = window.PROJECTS || [];
    let activeTag = null;
    function el(tag, attrs, text) {
        const node = document.createElement(tag);
        Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function renderProjects() {
        if (!projectList || !projects.length) return;
        const tags = [...new Set(projects.flatMap(p => p.tags))].sort((a, b) => a.localeCompare(b));
        filters.setAttribute('aria-label', t('filterLabel'));
        filters.replaceChildren();
        [null, ...tags].forEach(tag => {
            const b = el('button', { type: 'button', class: 'filter-btn', 'aria-pressed': String(activeTag === tag) }, tag || t('all'));
            b.addEventListener('click', () => { activeTag = tag; renderProjects(); filters.querySelector('[aria-pressed="true"]').focus(); });
            filters.appendChild(b);
        });
        filters.hidden = false;
        const visible = projects.filter(p => !activeTag || p.tags.includes(activeTag));
        projectList.replaceChildren(...visible.map(p => {
            const card = el('article', { class: 'skill-card project-card' });
            card.appendChild(el('h3', {}, p.name));
            card.appendChild(el('p', {}, p.description[lang] || p.description.pt));
            const tagBox = el('div', { class: 'tags' });
            p.tags.forEach(tg => tagBox.appendChild(el('span', {}, tg)));
            card.appendChild(tagBox);
            card.appendChild(el('a', { href: p.url, target: '_blank', rel: 'noopener noreferrer' }, t('viewGithub')));
            return card;
        }));
        projectStatus.textContent = t('showing')(visible.length);
    }

    // ---------- Artigos (posts/posts.json) ----------
    const postList = document.getElementById('postList');
    let posts = null;
    function renderPosts() {
        if (!postList || !posts) return;
        if (!posts.length) { postList.replaceChildren(el('p', {}, t('noPosts'))); return; }
        postList.replaceChildren(...posts.map(p => {
            const card = el('article', { class: 'skill-card post-card' });
            const h = el('h3', {}, p.title[lang] || p.title.pt);
            card.appendChild(h);
            const date = new Date(p.date + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { dateStyle: 'long' });
            const meta = el('p', { class: 'post-date' });
            meta.appendChild(el('time', { datetime: p.date }, date));
            if (p.example) meta.appendChild(el('span', { class: 'badge' }, t('example')));
            card.appendChild(meta);
            card.appendChild(el('p', {}, p.summary[lang] || p.summary.pt));
            card.appendChild(el('a', { href: 'post.html?slug=' + encodeURIComponent(p.slug) }, t('readMore')));
            return card;
        }));
    }
    fetch('posts/posts.json')
        .then(r => r.json())
        .then(data => { posts = data.sort((a, b) => b.date.localeCompare(a.date)); renderPosts(); })
        .catch(() => { posts = []; renderPosts(); });

    // ---------- Formulário de contato ----------
    // Para envio direto (sem abrir o app de e-mail), crie um formulário no Formspree
    // ou Web3Forms e cole a URL aqui. Vazio = usa mailto: como alternativa.
    const FORM_ENDPOINT = ''; // [PREENCHER: form endpoint] ex.: 'https://formspree.io/f/SEU_ID'
    const CONTACT_EMAIL = 'gesse.soares.macedo@gmail.com';
    const form = document.getElementById('contactForm');
    if (form) {
        const status = document.getElementById('formStatus');
        const fields = {
            name: [form.elements.name, v => v.trim().length >= 2, 'errName'],
            email: [form.elements.email, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'errEmail'],
            message: [form.elements.message, v => v.trim().length >= 10, 'errMessage']
        };
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            status.className = 'form-status';
            let firstBad = null;
            Object.values(fields).forEach(([input, ok, msg]) => {
                const bad = !ok(input.value);
                input.setAttribute('aria-invalid', String(bad));
                if (bad && !firstBad) firstBad = [input, msg];
            });
            if (firstBad) {
                status.textContent = t(firstBad[1]);
                status.classList.add('error');
                firstBad[0].focus();
                return;
            }
            if (form.elements.website.value) return; // honeypot preenchido: provável bot
            const data = { name: fields.name[0].value.trim(), email: fields.email[0].value.trim(), message: fields.message[0].value.trim() };
            if (!FORM_ENDPOINT) {
                status.textContent = t('mailto');
                const body = `${data.message}\n\n— ${data.name} <${data.email}>`;
                window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('subject'))}&body=${encodeURIComponent(body)}`;
                return;
            }
            status.textContent = t('sending');
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(Object.assign({ _subject: t('subject') }, data))
            }).then(r => {
                if (!r.ok) throw new Error(r.status);
                form.reset();
                status.textContent = t('sent');
                status.classList.add('success');
            }).catch(() => {
                status.textContent = t('failed');
                status.classList.add('error');
            }).finally(() => { btn.disabled = false; });
        });
    }

    // Idioma inicial: ?lang=en > escolha salva > português
    const qs = new URLSearchParams(location.search).get('lang');
    if (qs === 'en' || qs === 'pt') store('lang', qs);
    const initial = qs || read('lang') || 'pt';
    if (initial === 'en') applyLang('en');
    else { updateThemeButton(); renderProjects(); }
})();
