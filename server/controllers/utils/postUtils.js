


const checkReceiverSyntax = (receiver) => {
    if (receiver != "") {
        if ( (receiver[0] == "@") || (receiver[0] == "§") ) {
        return true;
        }
    }
    return false;
}
  

const parseTextForMentions = (text) => {
    const regex = /([@][a-zA-Z0-9]+)|[§]([a-z0-9]+|[A-Z0-9]+)/g;
    const matches = text.match(regex);
    return filteredMatches;
}




module.exports = {
    checkReceiverSyntax,
    parseTextForMentions
  };