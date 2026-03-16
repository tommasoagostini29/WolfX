# WolfX Trading Live

WolfX è una Progressive Web App (PWA) di trading per criptovalute. Permette agli utenti di simulare investimenti sul mercato reale partendo da un portafoglio virtuale di 10.000$.

---

## Stack Tecnologico

* **Frontend**: React.js, Vite, React Router DOM.
* **Autenticazione**: Firebase Authentication (con obbligo di verifica email per l'accesso).
* **Database**: Firebase Cloud Firestore (Database NoSQL per la gestione realtime di saldi e portafogli).
* **PWA (Progressive Web App)**: Implementazione con `manifest.json` e Service Worker (installazione su Home Screen e schermata di fallback offline).
* **API Dati di Mercato**: CoinGecko API (con sistema di caching locale personalizzato per ottimizzare le prestazioni e prevenire blocchi da Rate Limit).
* **Hosting & Deploy**: Firebase Hosting (ottimizzato per Single Page Applications) e salvataggio sorgente su GitHub.

---

## Funzionalità Principali

* **Onboarding Sicuro**: Registrazione con validazione campi, invio automatico del link di verifica email e assegnazione istantanea del capitale virtuale.
* **Home & Portafoglio**: Visualizzazione del patrimonio totale ricalcolato in tempo reale (Cash + Controvalore Crypto) e lista degli asset posseduti con scorciatoia per la vendita.
* **Mercato Live**: Tabella dinamica delle principali criptovalute con caricamento istantaneo tra le pagine grazie alla memoria cache interna.
* **Sistema di Trading**: Interfaccia a comparsa (Modale) per acquisto e vendita, calcolo automatico del massimo importo scambiabile (Tasto "MAX"), controlli di copertura finanziaria e notifiche di successo.
* **Esperienza Mobile-First**: Assenza di header ingombranti, navigazione tramite Bottom Navigation Bar e routing fluido senza ricaricamento della pagina.

---

## Come avviare il progetto in locale

Segui questi passaggi per clonare e testare l'app sul tuo computer:

1. Clona questo repository sul tuo computer.
2. Apri il terminale nella cartella del progetto e installa le dipendenze con il comando: `npm install`
3. Configura le tue chiavi di Firebase nel file di ambiente (es. `.env`).
4. Avvia il server di sviluppo locale digitando: `npm run dev`