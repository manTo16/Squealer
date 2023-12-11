// Funzione per aggiornare il conteggio dei caratteri
function updateCharCount() {
    // Ottieni il testo inserito dall'utente
    var inputText = document.querySelector('.shareInput').value;
    // Calcola la lunghezza del testo
    var charCount = inputText.length;
    // Aggiorna il testo del contatore
    document.getElementById('charCount').innerText = 'Caratteri inseriti: ' + charCount;
  }
  