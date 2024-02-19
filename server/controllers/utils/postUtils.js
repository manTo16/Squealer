
//username, canali, CANALI e keywords
const addressRegex = /^@[a-zA-Z0-9-._]+$|^§([a-z0-9-]+|[A-Z0-9-]+)$|^#[a-zA-Z0-9-_]+$/

//espressione regolare per utenti normali che non possono postare nei §CANALI
const receiverSyntax = /^@[a-zA-Z0-9-._]+$|^§([a-z0-9-]+)$|^#[a-zA-Z0-9-_]+$/


//i canali riservati non possono essere inclusi nei destinatari
const checkReceiverSyntax = (receiver) => {
    return (receiverSyntax.test(receiver))
}

const checkAddressSyntax = (address) => {
    return (addressRegex.test(address))
}

const parseTextForMentions = (text) => {
    const matches = text.match(addressRegex);
    return matches;
}

module.exports = {
    checkReceiverSyntax,
    parseTextForMentions,
    checkAddressSyntax
  };