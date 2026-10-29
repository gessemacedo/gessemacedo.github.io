# Gessé Soares | Currículo online

Site pessoal e currículo de **Gessé Soares**, Desenvolvedor de Software e Analista de Sistemas em São Paulo.

🔗 **Site:** https://gessemacedo.github.io/

<!-- [PREENCHER: captura de tela do site, ex.: ![Prévia do site](preview.png)] -->

## Stack
- HTML5 semântico, CSS3 (sem frameworks) e JavaScript puro
- Hospedagem: GitHub Pages (branch padrão, raiz do repositório)

## Estrutura
| Arquivo | Conteúdo |
|---|---|
| `index.html` | Conteúdo, metatags de SEO/Open Graph e JSON-LD |
| `styles.css` | Estilos e responsividade |
| `script.js` | Menu mobile, rolagem suave, animações e cálculo dos anos de experiência |
| `script.js` | Também: tema, idioma, filtro de projetos, artigos e formulário |
| `i18n.js` | Traduções em inglês (o português fica no próprio HTML) |
| `projects.js` | Lista de projetos da seção Projetos |
| `posts/posts.json` + `posts/*.md` | Artigos do blog |
| `post.html`, `post.js`, `blog.js` | Página do artigo e renderizador de Markdown |
| `assets/cv.pdf`, `assets/cv-en.pdf` | CV em PDF gerado a partir do site |
| `tools/gerar-cv.py` | Script que gera os PDFs |
| `favicon.svg` | Ícone do site |

## Recursos
- **Tema claro/escuro:** segue `prefers-color-scheme`; a escolha manual fica salva em `localStorage`.
- **PT/EN:** botão no menu ou `?lang=en`; salva a escolha e ajusta `<html lang>`. Para traduzir um texto novo, coloque `data-i18n="chave"` no elemento e adicione `chave` em `i18n.js` (`I18N.en`). [REVISAR: texto em inglês]
- **Projetos com filtro:** edite `projects.js`; os botões de tecnologia são gerados a partir das `tags`.
- **Formulário de contato:** em `script.js`, preencha `FORM_ENDPOINT` com a URL do Formspree (`https://formspree.io/f/SEU_ID`) ou Web3Forms. Vazio = abre o app de e-mail (`mailto:`). Tem honeypot anti-spam e validação.
- **Sem JavaScript:** todo o conteúdo continua visível em português; o formulário usa `mailto:`.

## Como publicar um artigo
1. Crie `posts/meu-artigo.md` (Markdown: títulos, listas, **negrito**, *itálico*, `código`, links, citações e blocos de código).
2. Adicione em `posts/posts.json`:
   ```json
   { "slug": "meu-artigo", "file": "meu-artigo.md", "date": "2026-11-01",
     "title": { "pt": "Título", "en": "Title" }, "summary": { "pt": "Resumo", "en": "Summary" } }
   ```
3. Apague o post de exemplo (`posts/exemplo.md` e a entrada com `"example": true`). [PREENCHER]
4. Commit e push. O artigo abre em `post.html?slug=meu-artigo`.

## Regenerar o CV em PDF
Depois de editar o conteúdo, rode `tools/gerar-cv.py` (instruções no topo do arquivo) e faça commit dos PDFs.

## Domínio próprio (ex.: gessemacedo.dev)
Ainda **não** há arquivo `CNAME`: só adicione depois de comprar o domínio.
1. Compre o domínio (Cloudflare Registrar, Porkbun etc.). Domínios `.dev` exigem HTTPS (HSTS preload); o GitHub Pages emite o certificado.
2. No DNS do domínio crie:
   - `A` no apex (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` no apex: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` `www` → `gessemacedo.github.io`
   - Na Cloudflare, deixe os registros como **DNS only** (nuvem cinza).
3. No GitHub: *Settings → Pages → Custom domain* → `gessemacedo.dev` → Save (isso cria o arquivo `CNAME` no repositório). Recomendado: verificar o domínio em *Settings (da conta) → Pages → Add a domain*.
4. Aguarde o certificado e marque **Enforce HTTPS**.
5. Atualize no `index.html` o `canonical`, `og:url`, `og:image`, JSON-LD e `hreflang` para o novo domínio.

## Rodar localmente
```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Contato
- LinkedIn: https://www.linkedin.com/in/gess%C3%A9-soares-b518b3161/
- Email: gesse.soares.macedo@gmail.com

## Licença
[MIT](LICENSE)
