"""Gera assets/cv.pdf (PT) e assets/cv-en.pdf (EN) a partir do site, usando o CSS de impressão.
Uso (na raiz do repositório):
    python3 -m http.server 8765 &
    pip install playwright && python3 -m playwright install chromium
    python3 tools/gerar-cv.py
"""
from playwright.sync_api import sync_playwright
import os
URL = os.environ.get('CV_URL', 'http://localhost:8765/')
with sync_playwright() as p:
    exe = os.environ.get('CHROME')  # ex.: /usr/bin/google-chrome (opcional)
    b = p.chromium.launch(**({'executable_path': exe} if exe else {}), args=['--no-sandbox'])
    for lang, out in [('pt', 'assets/cv.pdf'), ('en', 'assets/cv-en.pdf')]:
        c = b.new_context(); pg = c.new_page()
        pg.goto(URL + '?lang=' + lang); pg.wait_for_timeout(800)
        pg.emulate_media(media='print')
        pg.pdf(path=out, format='A4', print_background=True)
        c.close(); print('ok', out)
    b.close()
