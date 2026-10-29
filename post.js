(function () {
    'use strict';
    const body = document.getElementById('postBody');
    const slug = new URLSearchParams(location.search).get('slug');
    let lang = 'pt';
    try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'pt'; } catch (e) {}
    if (lang === 'en') {
        document.documentElement.lang = 'en';
        document.getElementById('backLink').textContent = '← Back to articles';
        document.querySelector('.skip-link').textContent = 'Skip to content';
    }
    const fail = (msg) => { body.innerHTML = '<p>' + msg + '</p>'; };
    fetch('posts/posts.json')
        .then(r => r.json())
        .then(posts => {
            const post = posts.find(p => p.slug === slug);
            if (!post) throw new Error('not found');
            const title = post.title[lang] || post.title.pt;
            document.title = title + ' | Gessé Soares';
            return fetch('posts/' + encodeURIComponent(post.file)).then(r => {
                if (!r.ok) throw new Error('file');
                return r.text();
            }).then(md => {
                const date = new Date(post.date + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { dateStyle: 'long' });
                body.innerHTML = '<h1>' + title.replace(/</g, '&lt;') + '</h1><p class="post-date"><time datetime="' + post.date + '">' + date + '</time></p>' +
                    window.renderMarkdown(md.replace(/^#\s+.*\n/, ''));
            });
        })
        .catch(() => fail(lang === 'en' ? 'Article not found.' : 'Artigo não encontrado.'));
})();
