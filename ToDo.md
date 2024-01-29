# ToDo
### Legenda 
- Nero: ***OBBLIGATORIO*** per la consegna
- <span style="color:Green">Verde: ***obbligatorio*** poiché progetto universitario ma non necessario per il mercato 
- <span style="color:orange">Arancione: ***non obbligatorio***, servizi opzionali per migliorare la valutazione
## App
### Funzioni di accounting
- [ ] creazione di account
    - messaggi di errore se si sbaglia password, se il nome utente esiste già, eccetera
    - *il form della registrazione dovrebbe mostrare meglio gli errori: username già esistente, eccetera. magari tenendo il bottone disabled anche in certi casi.*
        - si può usare il validate di react bootstrap che può far comodo per settare alcuni campi come richiesti
    - grafica: sarebbe carino avere tutto dello stesso sfondo grigio anche se il telefono è molto alto, sia in login che in registrazione. quindi avere il tasto login sempre in fondo alla pagina
- [ ] cambio password
- [ ] reset password
    - *per me si può fare molto semplicemente che da loggato accedi alle impostazioni profilo, schiacci un tasto e questo ti genera un codice alfanumerico che ti setta come password e te la fa vedere magari anche con un tasto copia. per non impazzire con email o domande di riserva*
- [ ] eliminazione
    - *dobbiamo stare attenti a quando vediamo un profilo o un post di un utente cancellato. o mettiamo nel database un campo booleano **DELETED** che ci dice se l'utente è "eliminato" e agiamo di conseguenza, oppure facciamo dei controlli per i nulli un po' ovunuque. inoltre, visto che abbiamo tenuto l'username come chiave unica, dobbiamo impedire che un utente si possa registrare con un username già usato, anche se è di un utente cancellato, altrimenti si rischiano di mischiare post dell'utente vecchio. oppure ricominciamo ad usare userId, che mi sembrava ridondante ma alla fine fa comodo per questo*
- [ ] scelta tipo di account: verificato, pro, smm, moderatore
    - [x] campi database
    - [ ] login/registrazione dedicato smm
    - [ ] login/registrazione dedicato moderatore
- [x] scelta di un social media manager
- [x] rimozione de smm

    *facoltative*
    
- [x] <span style="color:orange"> Acquisto caratteri aggiuntivi giornalieri, settimanali, mensili 
    - [ ] (solo verificati e pro)
- [x] <span style="color:orange"> Acquisto di un §canale personalizzato (caratteri minuscoli)
    - [ ] *non è un acquisto, la creazione è libera. ma secondo me va bene uguale*
- [x] <span style="color:orange"> Aggiunta di altri amministratori al §canale di proprietà 

### Funzioni di lettura senza login
- [ ] Solo messaggi di canali ufficiali Squealer

### Funzioni di lettura con login
- [ ] Per default organizzata in maniera temporale inversa, mescolando messaggi personali, canali a cui sono iscritto, canali ufficiali Squealer.
- [ ] Si mostrano solo destinatari §canale, §CANALE e #keyword, mai @individui.
- [x] Ricerca per §canale, #keyword e menzione (nel corpo del testo).
- [x] Reazioni: 1 positiva e 1 negativa <span style="color:orange">oppure 3-4 di tipo positivo e 3-4 di tipo
negativo.</span>

### Funzioni di scrittura
- [x] Creazione nuovo squeal di tipo testo, immagine (copia e incolla da Internet <span style="color:orange"> oppure accesso a fotocamera e foto del cellulare </span>) o geolocazione (accesso al sistema di geolocalizzazione del cellulare, visualizzazione della posizione su mappa)
    - [ ] video *(per ora non si possono postare e non sono gestiti in alcun modo nel backend)*
- [x] Risposta a squeal altrui (oltre alla reazione – condivide i destinatari pubblici)
- [x] Counter sempre aggiornati con caratteri residui giornalieri, settimanali e mensili – distinzione tra caratteri effettivamente residui e caratteri che rimarrebbero dopo la pubblicazione di questo post
- [x] Specifica di destinatari (@individui, §canali minuscoli e/o #keyword)
- [ ] Ripetizione del messaggio ogni tot secondi (con parti variabili che si aggiornano ogni volta). 
    - Beep acustico ad ogni ripetizione.
    - [x] ripetizione normale
    - <span style="color:orange">contenuti dinamici nei post ripetuti: data/ora, contatori incrementali, altre idee pazze</span>
    - [ ] ripetizione posizione aggiornata

### Altre pippe app
potete cancellari man mano che li facciamo

Grafica:
- pagina ricerca:
    - i tasti per cambiare da post a canale e utente a keywork sono orrendi
    - nella sezione canali bisognerebbe mettere un modo un po' più carino per far vedere i canali, quello che c'è nella pagina utente è carino si potrebbe copiare
    - idem per gli utenti, una cosa che fa vedere l'immagine profilo l'username e qualche informazione che sia cliccabile sarebbe carino
- pagina canale: 
    - intestazione canale da migliorare
- barra superiore:
    - sloggati non vedono calendari
    - chi è in debito non vede i caratteri ma vede il debito

Canali riservati:
- notizie
- pagine wikipedia a caso
- foto di gatti?
- altre idee per messaggi automatici sono ben accette. se si possono prendere da un'api pubblica già fatta meglio

Feed:
- creare feed particolari:
    - feed standard (non ALL, non devono vedersi messaggi privati, risposte, e insomma va un po' cambiato)
    - feed trending (qualche logica scrausa per emulare le cose in "tendenza" con tante visualizzazioni, magari i più visualizzati delle ultime 24h che ne so)
    - altri feed non mi vengono in mente

**Notifiche?**
- *Gli indirizzi specificati come menzioni sono solo ricercabili, mentre gli
indirizzi specificati come destinatari vengono notificati agli iscritti
all'indirizzo stesso*


<span style="color:orange">Alcuni canali non sono mai silenziabili: §ALL, §EMERGENCY, §EMERGENCY_BOLOGNA, ecc</span>

Impostazioni profilo:
- sarebbe carino ma non è requisito minimo poter cambiare foto e display name, tanto dovrebbe essere semplice

Squealer: il formato dei messaggi
- Categoria (privato, pubblico, popolare, impopolare, controverso)
- Canali Squealer a cui è stato aggiunto dalla redazione

Pagine 404

## SMM dashboard
- [x] Sia il VIP sia il SMM debbono essere account pro. Il VIP scegli il SMM e può successivamente rimuoverlo.
- [ ] <span style="color:orange">SMM multiplo: il SMM può dover gestire diversi account VIP (diciamo anche a 5- 6, ma non c'è un numero massimo). NON DEVE SBAGLIARSI PER NESSUN MOTIVO.
- [ ] il SMM deve poter postare squeal a nome e per conto del VIP. Non deve essere possibile per i destinatari distinguere se lo squeal è del VIP o del suo SMM.
- [ ] risposte ai post, post con più e meno reazioni, post popolari, post a rischio controversia o impopolare. Caratteri residui giornalieri, settimanali, mensili
    NON SI PUO' RIMANERE MUTI PER MANCANZA DI CARATTERI
- [ ] <span style="color:orange">**Acquisto d'emergenza di caratteri (a prezzo maggiorato)**
- [ ] <span style="color:orange">**Trend dei post del VIP**: grafici con andamenti storici di popolarità, numero di reply, frequenza di post, ecc.
- [ ] <span style="color:green">**Geolocazione fittizia**: il SMM può cliccare in una posizione qualunque della mappa e mandare uno squeal geolocalizzato lì.

## moderator dashboard
- ***obbligatoriamente*** in javascript puro, web app solo desktop.
- [ ] Il moderatore può elencare gli utenti e filtrarli per nome, tipo e popolarità. Può bloccare e riabilitare gli utenti a mano. Può aumentare a mano i caratteri residui per singoli utenti.
- [ ]  il moderatore può elencare i post e filtrarli per mittente, data e destinatari. Può cambiare a mano i destinatari (ad esempio, aggiungere §CANALI ufficiali Squealer). Può cambiare a mano il numero di reazioni positive e/o negative
- [ ] <span style="color:orange"> il moderatore può elencare i §canali degli utenti e filtrarli per proprietari, numero di post e popolarità. Può cambiare a mano i proprietari ed il nome. Può bloccare un §canale.
- [ ] il moderatore può elencare i §CANALI ufficiali Squealer, aggiungerne, toglierne e cambiarne la descrizione (utile per gli altri moderatori). Può aggiungere uno squeal ad un §CANALE o rimuoverlo in qualunque momento.