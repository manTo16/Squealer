import { channelsURL } from "../urls.mjs"

function trimFilterIdString(string) {
    return string.replace("filter_", "").replace("Field", "")
}


async function fetchChannelData(channelName) {
    return await fetch(`${channelsURL}/data/${channelName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .catch((error) => {
    console.error('errore fetchChannelData:', error)
    })
}



export async function sendChannelFilter() {
    let inputValues = {};
    
    //querySelectorAll ritorna un oggetto, non un array. quindi converto
    let inputs = Array.from(document.querySelectorAll('#sidebarOfPage input[type="text"]'))
    inputs = inputs.concat(Array.from(document.querySelectorAll('#sidebarOfPage input[type="number"]')))
    console.log(inputs)

    inputs.forEach(input => {
        const inputId = input.getAttribute("id")
        const useField = document.getElementById("use_"+ inputId)
        const use = useField.checked

        if (use && input.value !== "") {
            inputValues[trimFilterIdString(inputId)] = input.value
        }
    })

    //l'api non vuole la @ all'inizio
    if ("owner" in inputValues && inputValues["owner"].startsWith("@")) inputValues["owner"] = inputValues["owner"].slice(1)
    
    
    console.log("richiesta: ", inputValues);


    const response = await fetch(`${channelsURL}/mod/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputValues),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Errore sendChannelFilter():', error)
    })

    return response
}



export async function displayChannels(channels) {
    //const displayer = document.getElementById("channelsViewer")
    let displayer = $("#channelsViewer")

    channels.forEach(async channelName => {
        const channelData = await fetchChannelData(channelName)

        let channelWrapper = $(`<div 
        style="padding: 15px;
        box-shadow: 0 0 4px #00000052;
        border-radius: 20px;"></div>`);
        channelWrapper.append($(`<h6 style="margin-bottom: 0px;">Nome canale</h6>`));
        let channelTitle = $(`<h2 style="padding-left: 20px">${channelData.channelName}</h2>`);
        channelWrapper.append(channelTitle);

        let channelDescription = $(`<p style="padding-left: 20px; padding-right: 20px">${channelData.description}</p>`);
        if(channelData.description) {
            channelWrapper.append($("<h6>Description</h6>"));
            channelWrapper.append(channelDescription);
        }


        if(channelData.usernames.owners.length > 0) {
            channelWrapper.append($(`<h6>Owners</h6>`));
            let channelOwners = $(`<ul></ul>`);
            channelData.usernames.owners.forEach(owner => {
                let ownerListItem = $(`<li>${owner}</li>`);
                channelOwners.append(ownerListItem);
            });
            channelWrapper.append(channelOwners);
        }

        displayer.append(channelWrapper);

        displayer.append($("<hr/>"));

        /*
        const channelWrapper = document.createElement("div")

        const channelTitle = document.createElement("h2")
        channelTitle.innerText = channelData.channelName
        channelWrapper.appendChild(channelTitle)

        const channelDescription = document.createElement("p")
        channelDescription.innerText = channelData.description
        channelWrapper.appendChild(channelDescription)

        const channelOwners = document.createElement("ul")
        console.log("AAAAAA ", channelData.usernames.owners)
        channelData.usernames.owners.forEach(owner => {
            const ownerListItem = document.createElement("li")
            ownerListItem.innerText = owner
            channelOwners.appendChild(ownerListItem)
        })
        channelWrapper.appendChild(channelOwners)

        displayer.appendChild(channelWrapper)
*/
    })
}

export async function setChannels() {
    document.getElementById("channelsViewer").innerHTML = ''
    const channels = await sendChannelFilter()
    displayChannels(channels)
}




//assegnazione addEventListener
document.getElementById("sendChannelFilterButton").addEventListener("click", setChannels)

