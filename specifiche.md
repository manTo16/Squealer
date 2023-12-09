# Squealer

## Fondamenti

* Squealer è un social network di brevi messaggi detti squeal
* Sebbene non ci sia, come in Twitter, un numero massimo di caratteri nel singolo essaggio, **c'è un numero massimo di caratteri al giorno, alla settimana e al mese <ins>per i messaggi pubblici**</ins>
* Un utente può esaurire questa quota in un unico messaggio lungo, pochi messaggi di media lunghezza o tanti messaggi brevi. 
* I messaggi possono essere indirizzati ad un singolo utente, oppure ad un canale, oppure a tutti (pubblici). Le reazioni sono importanti
* I messaggi possono contenere testo, link (anche abbreviati), immagini e geolocazioni. Il rapporto tra immagini e testo è che *"un'immagine vale mille parole"* Per noi **mille bit**, cioè 125 caratteri. Una geolocazione viene mostrata come una mappa e conta come un'immagine.

## La quota di caratteri

* Squealer non ha quota di caratteri per messaggio.
* All'iscrizione, l'utente riceve una quota di default di caratteri che può usare al giorno (D), alla settimana (W < 7*D) e al mese (M < W*4 ).
* <span style="color:green">Questa quota è parametrica e deve essere modificabile velocemente.</span>
* La quota residua è sempre visibile e viene automaticamente aggiornata mentre sto scrivendo messaggi.
* <span style="color:orange">Se l’utente ha terminato la quota e sta ancora componendo un messaggio, può usare un certo numero F di caratteri extra. Questa quantità va visualizzata in maniera appropriata, non può essere usata per comporre un messaggio da zero e dovrà essere “pagata” in seguito</span>
* I messaggi ad utenti specifici (non a canali, non pubblici) non usano quota e sono sempre disponibili anche senza quota residua.
* Un utente può aumentare la quota comprandola (per un anno), oppure ottenendo apprezzamenti dal proprio pubblico. Similmente, le reazioni negative diminuiscono la quota (anche quella comprata) fino a farla scomparire (vedi prossime slide)

## I destinatari

* Squealer usa indirizzi per diffondere gli squeal, ma distingue tra menzioni e destinatari
* La sintassi degli indirizzi è la stessa ma la menzione appare nel corpo del messaggio mentre il destinatario ha un campo tutto suo.
  * <span style="color:cyan">@individuo</span> associato ad un singolo utente registrato.
  * <span style="color:cyan">§canale</span> (lettere minuscole) è un canale di squeal di proprietà di uno o più utenti, che decidono chi può leggerli e chi può scriverne di nuovi.
  * <span style="color:cyan">§CANALE</span> (lettere maiuscole) sono canali riservati a SQUEALER e gestiti dalla redazione. Vedi dettagli nella prossima slide.
  * <span style="color:cyan">#keyword</span> sono "canali" estemporanei creati in qualunque momento e accessibili da chiunque senza permessi o limitazioni.
* Gli indirizzi specificati come menzioni sono solo ricercabili, mentre gli indirizzi specificati come destinatari vengono notificati agli iscritti all'indirizzo stesso

## Canali riservati

* Squealer prevede un certo numero di canali riservati (identificati con un §CANALE in lettere maiuscole) e gestiti dalla redazione interna
* Ogni gruppo sceglie quali canali rendere disponibili e la logica di ogni canale. Alcuni possono essere popolati automat### icamente sulla base di regole, altri attraverso l'intevento manuale di un moderatore.
* E’ obbligatorio includere 3 §CANALI riservati tra cui almeno un canale §CONTROVERSIAL (vedi prossima slide)
* Alcuni esempi:
  * Squeal di tendenza: §TRENDING, §NEWS, §TOP_1000
  * Squeal random: §RANDOM_1000, §RANDOM_ITALY, §RANDOM_BOLOGNA (e qualunque altra area definita dalla redazione)
  * Squeal importanti: §ALL, §EMERGENCY, §EMERGENCY_BOLOGNA, ecc.
  * Squeal controversi: §CONTROVERSIAL_TOP, §CONTROVERSIAL_1000, §CONTROVERSIAL_ITALY, §CONTROVERSIAL_RANDOM
* <span style="color:orange">Alcuni canali non sono mai silenziabili: §ALL,
§EMERGENCY, §EMERGENCY_BOLOGNA, ecc.</span>

## Le reazioni

* Di ogni messaggio si contano le *impression X* (il numero di utenti, registrati o meno, che l'hanno visualizzato). Si escludono i destinatari individuali.
* Ogni utente, registrato o meno, può reagire ad un messaggio in maniera positiva o negativa con appositi emoji <span style="color:orange">(scelti dal gruppo, ad es. “Concordo”, “Mi piace”, "sono contrario", "mi disgusta", ecc.)</span>
* Esiste una massa critica (CM) di reazioni positive e negative. Le reazioni polarizzate (R+ e R-) vengono contate separatamente, non si annullano mai. Il valore della massa critica è uguale sia per R+ che R-. <span style="color:green">Proviamo con CM = 0.25 * X.</span>
* Ogni messaggio che supera la massa critica viene etichettato come "popolare” (R+ > CM ), "impopolare" (R- > CM) o "controverso” (se sia R+ che R- superano la soglia CM).
* Un utente che posta messaggi sistematicamente popolari viene premiato con un aumento di quota, se impopolari riceve una diminuzione della quota fino a zero (inclusa la quota acquistata): ogni 10 messaggi con R+>CM vinco 1% della quota iniziale, ogni 3 messaggi con R- > CM perdo 1% della quota iniziale.
* I messaggi controversi non contano per la variazione della quota, ma appaiono
nei canali dedicati (§CONTROVERSIAL)

## Il formato dei messaggi

* Ogni messaggio ha un corpo e un elenco di destinatari sotto il
controllo dell'autore, e una serie di metadati generati
automaticamente o manualmente dal moderatore Squealer.
  * Il corpo è un messaggio di testo, OPPURE un'immagine OPPURE un video, oppure una geolocazione.
  * I destinatari sono un elenco di indirizzi di individui, canali o keyword,senza limiti e senza impatto sulla quota.
  * Data ed ora del messaggio non modificabili
  * #reazioni positive (<span style="color:orange">divise per sottotipo</span>)
  * #reazioni negative (<span style="color:orange">divise per sottotipo</span>)
  * Categoria (privato, pubblico, popolare, impopolare, controverso)
  * Canali Squealer a cui è stato aggiunto dalla redazione
* Esistono inoltre messaggi automatici o derivati da sorgenti esterne
(vedi prossima slide)

## Messaggi automatici e da sorgenti esterne

* Ogni gruppo deve implementare almeno 3 tipi di messaggi generati automaticamente. Di questi, il tipo "messaggi
temporizzati" è obbligatorio, gli altri 2 a discrezione.
* Alcuni esempi:
  * Messaggi temporizzati: generati ogni TOT secondi a contenuto fisso o
  variabile attraverso data, ora e contatore. Sono utili per servizi digeolocalizzazione (vedi prossime slide). Ad esempio: "Ciao a tutti, questo èil mio messaggio n. {NUM} delle ore {TIME} del giorno {DATE}. ”
  * <span style="color:orange">News: news lette da API pubbliche o da feed RSS e trasformati in squeal
  * <span style="color:orange">Immagini Causali: immagini recuperate da API pubbliche disponibili suWeb e trasformati in squeal
  * <span style="color:orange">Forse non sapevi che...: il testo iniziale di pagine random da Wikipedia.
  * <span style="color:orange">Twitter RIP: messaggi pubblici letti da canali Twitter attraverso l’API. Sappiamo che Twitter è destinato a scomparire ma gli diamo qualche ultima possibilità 😀"
  * <span style="color:orange">…</span>

## Georeferenziazione

* I messaggi temporizzati possono essere usati per costruire dinamicamente mappe e mostrarle in una pagina dedicata.
* Ad esempio, assumiamo che ogni ambulanza, autobus, taxi, camion di corrieri sia dotato di un proprio device con Squealer attivo
* Questo emette ogni N minuti uno squeal di geolocazione sulla propria posizione
* Questi squeal vengono raccolti in un canale e visualizzati come un unico segnale su una mappa, disponibile per tutti gli iscritti a quel canale
* Nella prossima slide alcuni esempi (non vincolanti) di servizi social che è possibile costruire sfruttando questa funzionalità

## Architettura del sistema

Esistono tre ambienti per usare Squealer:

* La **App**, ovvero l'applicazione per gli utenti finali e altamente mobili.
Mobile first, non adatta per grandi volumi di dati e uso
professionale.
* Il **SMM dashboard**, ovvero l'applicazione per influencer, VIP e
utenti professionali che permette di visualizzare in maniera
integrata e complessiva tutte le attività di interazione con il proprio
pubblico:, squeal, risposte, reazioni, trend, ecc. Questa è
un'applicazione per PC (ma non impossibile da usare su
smartphone)
* **Il moderator dashboard**, ovvero l'applicazione per moderatori e
redattori gestiti da Squealer, che verificano trend e reazioni,
attribuiscono punteggi, risolvono grane, gestiscono blocchi e
sblocchi, ecc. Questa è un'applicazione solo per PC.

### App

La app è l'interfaccia principale per i non-professionisti, in cui leggere gli squeal e crearne di nuovi. Ha dunque funzioni di lettura, di scrittura e di accounting.

#### Funzioni di accounting

* Creazione account, cambio password, reset password, eliminazione.
* Tipo di account: normale, <span style="color:orange">verificato</span>, professional, moderatore squealer.
* Scelta di un social media manager – rimozione del SMM. (entrambi professional: sia utente sia SMM)
* <span style="color:orange">Acquisto caratteri aggiuntivi giornalieri, settimanali, mensili (solo verificati e pro).
* <span style="color:orange">Acquisto di un §canale personalizzato (caratteri minuscoli)
* <span style="color:orange">Aggiunta di altri amministratori al §canale di proprietà

#### Funzioni di lettura senza login

* Solo messaggi di canali ufficiali Squealer (e.g.: §TRENDING, §NEWS, §TOP_1000,
§RANDOM_1000, §RANDOM_ITALY, §RANDOM_BOLOGNA)
Funzioni di lettura con login
* Per default organizzata in maniera temporale inversa, mescolando messaggi
personali, canali a cui sono iscritto, canali ufficiali Squealer.
* Si mostrano solo destinatari §canale, §CANALE e #keyword, mai @individui.
* Ricerca per §canale, #keyword e menzione (nel corpo del testo).
* Reazioni: 1 positiva e 1 negativa <span style="color:orange">oppure 3-4 di tipo positivo e 3-4 di tipo
negativo.
* Iscrizione e rimozione da §canali e §CANALI a scelta dell'utente.

#### Funzioni di scrittura

* Creazione nuovo squeal di tipo testo, immagine (copia e incolla da Internet <span style="color:orange">oppure accesso a fotocamera e foto del cellulare</span>) o geolocazione (accesso al sistema di geolocalizzazione del cellulare, visualizzazione della posizione su mappa)
* Risposta a squeal altrui (oltre alla reazione – condivide i destinatari pubblici)
* Counter sempre aggiornati con caratteri residui giornalieri, settimanali e mensili – distinzione tra caratteri effettivamente residui e caratteri che rimarrebbero dopo la pubblicazione di questo post
* Specifica di destinatari (@individui, §canali minuscoli e/o #keyword)
* Ripetizione del messaggio ogni tot secondi (con parti variabili che si aggiornano ogni volta). Beep acustico ad ogni ripetizione.

### SMM dashboard

Il **SMM** è un'applicazione web tradizionale, solo online, sia per device mobili sia per PC, orientata a fornire accesso all'account di un VIP da parte di un Social Media Manager.

* **Tipi di account**: Sia il VIP sia il SMM debbono essere account pro. Il VIP scegli il
SMM e può successivamente rimuoverlo.
* <span style="color:orange">**SMM multiplo**: il SMM può dover gestire diversi account VIP (diciamo anche a 5- 6, ma non c'è un numero massimo). NON DEVE SBAGLIARSI PER NESSUN MOTIVO.
* **Scrittura**: il SMM deve poter postare squeal a nome e per conto del VIP. Non deve essere possibile per i destinatari distinguere se lo squeal è del VIP o del suo SMM.
* **Monitoraggio**: risposte ai post, post con più e meno reazioni, post popolari, post a rischio controversia o impopolare. Caratteri residui giornalieri, settimanali, mensili NON SI PUO' RIMANERE MUTI PER MANCANZA DI CARATTERI
* <span style="color:orange">**Acquisto d'emergenza di caratteri (a prezzo maggiorato)**
* <span style="color:orange">**Trend dei post del VIP**: grafici con andamenti storici di popolarità, numero di reply, frequenza di post, ecc.
* <span style="color:green">**Geolocazione fittizia**: il SMM può cliccare in una posizione qualunque della mappa e mandare uno squeal geolocalizzato lì.

### moderatoro dashboard

Il moderator dashboard è la parte dell'applicazione che permette agli amministratori di Squealer di gestire i dati degli utenti e abilitare e configurare i servizi e i prodotti. Può accedere solo un utente moderatore Squealer.

E' un'applicazione web tradizionale, solo online, principalmente per PC.

* **Utenti**. Il moderatore può elencare gli utenti e filtrarli per nome, tipo e popolarità. Può bloccare e riabilitare gli utenti a mano. Può aumentare a mano i caratteri residui per singoli utenti.
* **Squeal**: il moderatore può elencare i post e filtrarli per mittente, data e destinatari. Può cambiare a mano i destinatari (ad esempio, aggiungere §CANALI ufficiali Squealer). <span style="color:green">Può cambiare a mano il numero di reazioni positive e/o negative.
* <span style="color:orange">**§canali**: il moderatore può elencare i §canali degli utenti e filtrarli per proprietari, numero di post e popolarità. Può cambiare a mano i proprietari ed il nome. Può bloccare un §canale.
* **§CANALI**: il moderatore può elencare i §CANALI ufficiali Squealer, aggiungerne,toglierne e cambiarne la descrizione (utile per gli altri moderatori). Può aggiungere uno squeal ad un §CANALE o rimuoverlo in qualunque momento. <span style="color:orange">Può aggiungere una regola che attribuisce automaticamente un post ad un canale se soddisfa un criterio.

## Requisiti di progetto

* Tutte le parti in nero sono obbligatorie
* Tutte le parti in arancione sono facoltative e generano punteggio extra a discrezione del docente.
* <span style="color:green">La app è mobile first, è realizzata con il framework Javascript e CSS preferito, ed è pensata soprattutto per essere usata velocemente e facilmente da tutti.
* <span style="color:green">Il SMM dashboard è sia mobile sia desktop, ed è realizzato con il framework Javascript e CSS preferito, purché diverso da app e da moderator dashboard. <span style="color:orange">È pensato per un professionista che ha un numero limitato di clienti (1-5)</span> ma che ha un traffico intenso sia in uscita sia di reazioni e like.
* <span style="color:green">Il moderator dashboard è **obbligatoriamente** in Javascript puro (va bene jQuery, va bene un framework CSS a scelta). E' una applicazione web solo desktop.
* <span style="color:green">Tutti i dati locali vengono memorizzati su un DB Mongo sul server del dipartimento.
* <span style="color:green">All'atto della presentazione del progetto tutti i database sono già riempiti con un numero ragionevole di utenti, messaggi, attività, ecc.
* <span style="color:green">In particolare sono già creati 4 account: "fv", "fvPro", "fvSMM" e "fvMod", con password "12345678". Sono poi anche già creati altri due account Nome Buffo1 e Nome Buffo2, di tipo Pro.
* <span style="color:green">fvPro, Nome Buffo1 e Nome Buffo2 sono clienti di fvSMM. Nome Buffo 1 è molto popolare ed è prossimo a aumentare la quota di caratteri, Nome Buffo 2 è molto impopolare ed è prossimo a esaurire la quota.
* <span style="color:green">Tutti e tre questi utenti sono a 50 caratteri dall'esaurire la quota giornaliera (libero settimanale e mensile)
* <span style="color:green">Ogni utente ha già postato un numero variabile di messaggi (vanno bene anche Lorem Ipsum) che hanno ricevuto un numero libero di like, dislike e risposte.