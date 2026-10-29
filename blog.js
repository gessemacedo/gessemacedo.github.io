/* Renderizador de Markdown mínimo (sem dependências) usado pelos artigos. */
(function () {
    'use strict';
    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function inline(s) {
        s = esc(s);
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|[\w./#-]+)\)/g, '<a href="$2">$1</a>');
        return s;
    }
    function render(md) {
        const lines = md.replace(/\r/g, '').split('\n');
        let html = '', list = null, para = [], quote = [], code = null;
        const flushPara = () => { if (para.length) { html += '<p>' + inline(para.join(' ')) + '</p>'; para = []; } };
        const flushList = () => { if (list) { html += `</${list}>`; list = null; } };
        const flushQuote = () => { if (quote.length) { html += '<blockquote>' + render(quote.join('\n')) + '</blockquote>'; quote = []; } };
        for (const line of lines) {
            if (code !== null) {
                if (/^```/.test(line)) { html += '<pre><code>' + esc(code.join('\n')) + '</code></pre>'; code = null; }
                else code.push(line);
                continue;
            }
            if (/^```/.test(line)) { flushPara(); flushList(); flushQuote(); code = []; continue; }
            if (/^>\s?/.test(line)) { flushPara(); flushList(); quote.push(line.replace(/^>\s?/, '')); continue; }
            flushQuote();
            let m;
            if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
                flushPara(); flushList();
                const lvl = Math.min(m[1].length + 1, 4); // # vira h2 (o h1 é o título da página)
                html += `<h${lvl}>${inline(m[2])}</h${lvl}>`;
            } else if ((m = line.match(/^\s*[-*]\s+(.*)$/)) || (m = line.match(/^\s*\d+\.\s+(.*)$/))) {
                flushPara();
                const type = /^\s*\d+\./.test(line) ? 'ol' : 'ul';
                if (list !== type) { flushList(); html += `<${type}>`; list = type; }
                html += '<li>' + inline(m[1]) + '</li>';
            } else if (!line.trim()) {
                flushPara(); flushList();
            } else {
                flushList(); para.push(line.trim());
            }
        }
        if (code !== null) html += '<pre><code>' + esc(code.join('\n')) + '</code></pre>';
        flushPara(); flushList(); flushQuote();
        return html;
    }
    window.renderMarkdown = render;
})();
