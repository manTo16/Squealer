
const addressRegex = /^@[a-zA-Z0-9-._]+$|^§([a-z0-9-]+|[A-Z0-9-]+)$|^#[a-zA-Z0-9-_]+$/

//espressione regolare per utenti normali che non possono postare nei §CANALI
const receiverSyntax = /^@[a-zA-Z0-9-._]+$|^§([a-z0-9-]+)$|^#[a-zA-Z0-9-_]+$/


//i canali riservati non possono essere inclusi nei destinatari
const checkReceiverSyntax = (receiver) => {
    return (receiverSyntax.test(receiver))
    /* vecchio controllo. ora abbiamo le espressioni regolari. molto più fighe
    if (receiver != "") {
        if ( (receiver[0] == "@") || (receiver[0] == "§") ) {
        return true;
        }
    }
    return false;
    */
}


const parseTextForMentions = (text) => {
    const matches = text.match(addressRegex);
    return matches;
}

module.exports = {
    checkReceiverSyntax,
    parseTextForMentions,
  };