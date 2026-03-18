# WolfX Trading Live

WolfX è una Progressive Web App (PWA) di trading per criptovalute. Permette agli utenti di simulare investimenti sul mercato reale partendo da un portafoglio virtuale di 10.000$.

---

## Stack Tecnologico

* **Front-end**: React.js, Vite.
* **Autenticazione**: Firebase Authentication, con verifica dell'email.
* **Database**: Firebase Firestore.
* **PWA (Progressive Web App)**: manifest.json (manifest.webmanifest) e service worker, pagina di fallback e installabile.
* **API Dati di Mercato**: CoinGecko API.
* **Hosting & Deploy**: Firebase Hosting e GitHub.

---

## Funzionalità Principali

* **Registrazione Sicura**: Registrazione con verifica credenziali, invio automatico del link di verifica email e assegnazione istantanea del denaro virtuale.
* **Home & Portafoglio**: Visualizzazione del proprio patrimonio calcolato in tempo reale (Cash + Crypto) e lista delle criptovalute possedute con possibilità di vendita.
* **Mercato Live**: Pagina di mercato e tabella dinamica delle principali criptovalute in tempo reale con possibilità di compera.
* **Notifiche**: In caso di compravendita si ricevono notifiche di successo.
* **BottomNav**: Navigazione tramite Bottom Navigation Bar e routing fluido senza ricaricamento della pagina.
