# Brief-Report-vendite-e-clienti-Fake-Store-
Il team commerciale ha bisogno di due report analitici sull’e-commerce, basati sui dati pubblici di Fake Store API. Tu sei responsabile di realizzare un’applicazione che li produca.

# Report vendite e clienti (Fake Store)

Programma TypeScript che scarica i dati da Fake Store API e stampa in console due report JSON:
top 3 prodotti più venduti e top 3 clienti per spesa totale, per `all_time` e `last_month`.

## Installazione

    npm install

## Avvio

    npm start

Richiede Node.js 18 o successivo. I due report vengono stampati uno dopo l'altro.

## Scelte di progetto

- **Ultimo mese:** gli ultimi 30 giorni dalla data del carrello più recente (estremi inclusi),
  perché i dati dell'API sono del 2020.
- **Parità:** prodotti, a parità di unità vince il fatturato maggiore, poi l'id più basso;
  clienti, a parità di spesa vince chi ha più ordini, poi l'id più basso.
- **Dati mancanti:** le righe con un prodotto assente dal catalogo sono ignorate;
  un cliente assente dall'anagrafica resta in classifica con username, nome ed email a `null`.