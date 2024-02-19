import { channelsURL } from "../urls.mjs";



export async function sendCreateChannelRequest(data) {
    fetch(`${channelsURL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


//assegnazione addEventListener
document.getElementById("createChannel_Button").addEventListener("click", () => {
    let channelName = document.getElementById("createChannel_channelNameField").value
    if (channelName === channelName.toUpperCase()) {
        const loggedUserData = JSON.parse(localStorage.getItem('user'))
        let data = {}
        if (channelName.startsWith("§")) channelName = channelName.slice(1)
        data["channelName"] = channelName
        data["username"] = loggedUserData.username
        data["description"] = ""
        data["reserved"] = true
        sendCreateChannelRequest(data)
    }
    else {
        const createChannelDiv = document.getElementById("createChannel_Div")
        const warning = document.createElement("p")
        warning.innerText = "Il nome del canale non va bene! Solo lettere maiuscole"
        createChannelDiv.appendChild(warning)
    }
})