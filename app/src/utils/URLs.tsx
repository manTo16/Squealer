


export function generateAddressURL(address: string) {
    let URLstring = ""
    switch(address[0]) {
      case "§":
        URLstring = `/channels/${address.slice(1)}`
        break
      case "@":
        URLstring = `/users/${address.slice(1)}`
        break
      case "#":
        URLstring = `/keywords/${address.slice(1)}`
        break
      default:
        break
    }
    return URLstring
  }