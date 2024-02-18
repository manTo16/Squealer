






//id incrementale per gli input dei destinatari
var destinatari = 0

// Gestione rimozione span dei destinatari
// Aggiunge l'evento click a tutti i bottoni con classe 'remove-button'
document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', function() {
        // Trova il genitore <span> più vicino e rimuovilo
        this.closest('span').remove();
    });
});



// Gestione aggiunta span dei destinatari
// TODO: inserire la gestione degli input(non so le idee del tossico di liam) suca ora cosa posso fare??
document.getElementById('addReceiverButton').addEventListener('click', function() {
    let newSpan = document.createElement('span');
    
    let input = document.createElement('input');
    input.type = 'text';
    input.name = 'filter_receiverField';
    input.id = `filter_receiverField_n${destinatari}`;
    destinatari++;
    newSpan.appendChild(input);
    
    // Aggiungi un bottone "-" al nuovo span
    let button = document.createElement('button');
    button.textContent = '-';
    button.className = 'remove-button'; // Assegna la classe per lo stile e l'identificazione
    button.onclick = function() {
        // Rimuove lo span quando il bottone "-" è cliccato
        this.parentNode.remove();
    };
    newSpan.appendChild(button);
    
    // Aggiungi il nuovo span all'elemento li con id="receiversFields"
    document.getElementById('receiversFields').appendChild(newSpan);
});

