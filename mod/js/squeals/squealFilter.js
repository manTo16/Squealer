import { apiPostsURL } from "../urls.mjs";
import { toggleEdit, untoggleEdit, saveChanges } from "./edit.mjs";
import { createGeoMap } from "./map.mjs";

function trimFilterIdString(string) {
    return string.replace("filter_", "").replace("Field", "").replace(/_n\d+/, "")
}

async function fetchSquealData(squealId) {
    return await fetch(`${apiPostsURL}/${squealId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('errore fetchSquealData:', error)
        })
}



export async function sendSquealFilter() {
    let inputValues = {};

    inputValues["receiver"] = []

    //querySelectorAll ritorna un oggetto, non un array. quindi converto
    let inputs = Array.from(document.querySelectorAll('#sidebarOfPage input[type="text"]'))
    let dateInputs = Array.from(document.querySelectorAll('#sidebarOfPage input[type="date"]'))
    let textareas = Array.from(document.querySelectorAll('#sidebarOfPage textarea'))
    console.log(inputs)
    console.log(dateInputs)
    console.log(textareas)
    inputs = inputs.concat(dateInputs).concat(textareas)
    console.log("grande array: ", inputs)

    inputs.forEach(input => {
        const inputId = input.getAttribute("id")
        const useField = document.getElementById("use_" + (inputId.replace(/_n\d+/, "")))
        const use = useField.checked

        if (use) {
            if ((trimFilterIdString(inputId) === "receiver") && (input.value != ""))
                inputValues["receiver"].push(input.value)
            else if (trimFilterIdString(inputId) !== "receiver" && (input.value != ""))
                inputValues[trimFilterIdString(inputId)] = input.value
        }
    })

    //l'api non vuole la @ all'inizio
    if ("sender" in inputValues && inputValues["sender"].startsWith("@")) inputValues["sender"] = inputValues["owner"].slice(1)


    console.log("OUTPUT FUNZIONE", inputValues);

    const response = await fetch(`${apiPostsURL}/mod/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputValues),
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Errore sendSquealFilter():', error)
        })

    return response
}

// Funzione per verificare se una stringa è una coppia di coordinate
function isCoordinates(str) {
    const regex = /^((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)[+]?)+|area$/;
    if (str.endsWith('area')) {
        //setIsArea(true);
    }
    return regex.test(str);
}

// Funzione per verificare se una stringa è un'immagine in base64
function isBase64(str) {
    return str.startsWith('data:image/');
}

export async function displayGeoMap() {
    const displayer = document.getElementById("squealViewer")
    const map = document.createElement("div")
    map.setAttribute("id", "map")
    map.style.width = "100%"
    map.style.height = "400px"
    displayer.appendChild(map)
    createGeoMap()

}


function createContentField(titleText, contentText) {
    const field = document.createElement("div")
    const title = document.createElement("h6")
    const content = document.createElement("p")
    title.innerText = titleText;
    title.style.marginBottom = "0px";
    field.appendChild(title)
    content.innerText = contentText
    content.style.paddingLeft = "10px";
    content.style.paddingRight = "10px";
    content.style.marginBottom = "0px";
    field.appendChild(content)
    field.style.borderLeft = "1px solid #0000004f";
    field.style.paddingLeft = "10px";
    field.style.marginBottom = "10px";

    return field;
}

export async function displaySqueals(squealIds) {
    const displayer = document.getElementById("squealViewer")

    squealIds.forEach(async squealId => {
        const squealData = await fetchSquealData(squealId)

        const squealWrapper = document.createElement("div")

        // Stile del div generale
        squealWrapper.setAttribute("style",
            `display: flex;
            flex-direction: column; 
            justify-content: space-around;
            padding: 15px;
            margin: 10px;
            box-shadow: 0 0 4px 0 #00000052;
            border-radius: 20px;
            `)

        // Parte dedicata all'username
        squealWrapper.appendChild(createContentField("Username: ", squealData.username))

        // Parte dedicata al display name
        squealWrapper.appendChild(createContentField("Display name: ", squealData.displayName))

        // Parte dedicata alla receiver's list, praticamente faccio un div
        // con dentro un ul e tanti li quanti sono i receiver
        const receiverField = createContentField("Receivers: ", "")
        // Rimuovo il "p" e metto la "ul" con padding 10px a destra e sinistra e margin bottom 0
        receiverField.removeChild(receiverField.querySelector("p"))
        const receiversList = document.createElement("ul")
        receiversList.style.paddingRight = "10px"
        receiversList.style.marginBottom = "0px"
        squealData.receivers.forEach(receiver => {
            const receiverItem = document.createElement("li")
            receiverItem.innerText = receiver
            receiversList.appendChild(receiverItem)
        })
        if (squealData.receivers.length == 0) {
            // Metto sotto la lista un none in italico e grigio
            const none = document.createElement("i")
            none.innerText = "none"
            none.style.color = "#0000004f"
            none.style.paddingLeft = "10px"
            none.style.paddingRight = "10px"
            none.style.marginBottom = "0px"
            receiverField.appendChild(none)
        }
        receiverField.appendChild(receiversList)

        squealWrapper.appendChild(receiverField)


        // Parte dedicata al testo
        if (isCoordinates(squealData.text)) {
            const coordinates = squealData.text.split(',');
            let geolocation = {}
            geolocation.latitude = coordinates[0];
            let area = false

            if (coordinates[1].endsWith('area')) {
                area = true;
                coordinates[1] = coordinates[1].replace('area', '');
            }

            if (coordinates[1].includes('+')) {
                geolocation.longitude = coordinates[1].split('+')[0];
            } else {
                geolocation.longitude = coordinates[1];
            }

            const mapDiv = document.createElement("div");
            mapDiv.style.width = "100%";
            mapDiv.style.height = "400px";
            mapDiv.style.marginBottom = "10px";
            mapDiv.style.paddingLeft = "10px";
            mapDiv.style.paddingRight = "10px";
            mapDiv.style.marginTop = "5px";
            mapDiv.setAttribute("id", `map_${squealData.postId}`);
            let geoMap = createGeoMap(geolocation, area, mapDiv);
            setInterval(() => {
                geoMap.invalidateSize();
            }, 1000);

            let mapField = createContentField("Contenuto Squeal: ", "");
            mapField.removeChild(mapField.querySelector("p"));
            mapField.appendChild(mapDiv);

            squealWrapper.appendChild(mapField);
        } else if (isBase64(squealData.text)) {
            let imgField = createContentField("Contenuto Squeal: ", "");
            imgField.removeChild(imgField.querySelector("p"));
            const img = document.createElement("img");
            img.src = squealData.text;
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.marginBottom = "10px";
            imgField.appendChild(img);
            squealWrapper.appendChild(imgField);
        }
        else {
            squealWrapper.appendChild(createContentField("Contenuto Squeal: ", squealData.text))
        }

        // Parte dedicata alla data di creazione dello squeal
        squealWrapper.appendChild(createContentField("Data di creazione: ", new Date(squealData.creationDate).toLocaleString()))


        // Parte dedicata alle impressioni

        // Lo stile da mettere a tutti i campi di like
        let styleOfLikesFields = `display: flex; 
            flex-direction: row; 
            justify-content: space-around;
            width: 180px;
            border-radius: 10px;
            height: fit-content;
            padding: 9px;
            border: 1px solid #ced4da;
            box-shadow: 0px 0 3px 0 #0000003d;`
        let styleOfDivisor = `height: auto;
        border-right: 1px solid #ced4da;
        /* border-radius: 2px; */
        box-shadow: 0px 0px 5px 0px #00000073;`

        // Div generico che conterrà tutti i campi di like
        const impressionsField = document.createElement("div")
        impressionsField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap")

        const veryLikesField = document.createElement("div")

        veryLikesField.setAttribute("style", styleOfLikesFields)
        const veryLikeIcon = document.createElement("p")
        veryLikeIcon.style.marginBottom = "0px";
        veryLikeIcon.innerText = "veryLike"
        veryLikesField.appendChild(veryLikeIcon)

        let divisor1 = document.createElement("div")
        divisor1.setAttribute("style", styleOfDivisor);
        veryLikesField.appendChild(divisor1);

        const veryLikeNumber = document.createElement("span")
        veryLikeNumber.setAttribute("class", "viewer_veryLikeNumber")
        veryLikeNumber.innerText = squealData.impressions.veryLikes.number
        veryLikesField.appendChild(veryLikeNumber)

        const likesField = document.createElement("div")
        likesField.setAttribute("style", styleOfLikesFields)
        const likeIcon = document.createElement("p")
        likeIcon.style.marginBottom = "0px";
        likeIcon.innerText = "like"
        likesField.appendChild(likeIcon)

        let divisor2 = document.createElement("div")
        divisor2.setAttribute("style", styleOfDivisor);
        likesField.appendChild(divisor2);

        const likeNumber = document.createElement("span")
        likeNumber.setAttribute("class", "viewer_likeNumber")
        likeNumber.innerText = squealData.impressions.likes.number
        likesField.appendChild(likeNumber)

        const dislikesField = document.createElement("div")
        dislikesField.setAttribute("style", styleOfLikesFields)
        const dislikeIcon = document.createElement("p")
        dislikeIcon.style.marginBottom = "0px";
        dislikeIcon.innerText = "dislike"
        dislikesField.appendChild(dislikeIcon)

        let divisor3 = document.createElement("div")
        divisor3.setAttribute("style", styleOfDivisor);
        dislikesField.appendChild(divisor3);

        const dislikeNumber = document.createElement("span")
        dislikeNumber.setAttribute("class", "viewer_dislikeNumber")
        dislikeNumber.innerText = squealData.impressions.dislikes.number
        dislikesField.appendChild(dislikeNumber)

        const veryDislikesField = document.createElement("div")
        veryDislikesField.setAttribute("style", styleOfLikesFields)
        const veryDislikeIcon = document.createElement("p")
        veryDislikeIcon.style.marginBottom = "0px";
        veryDislikeIcon.innerText = "veryDislike"
        veryDislikesField.appendChild(veryDislikeIcon)

        let divisor4 = document.createElement("div")
        divisor4.setAttribute("style", styleOfDivisor);
        veryDislikesField.appendChild(divisor4);

        const veryDislikeNumber = document.createElement("span")
        veryDislikeNumber.setAttribute("class", "viewer_veryDislikeNumber")
        veryDislikeNumber.innerText = squealData.impressions.veryDislikes.number
        veryDislikesField.appendChild(veryDislikeNumber)

        impressionsField.appendChild(veryLikesField)
        impressionsField.appendChild(likesField)
        impressionsField.appendChild(dislikesField)
        impressionsField.appendChild(veryDislikesField)
        squealWrapper.appendChild(impressionsField)

        // Aggiungo un hr tra i dati e i pulsanti
        const hrButtons = document.createElement("hr")
        hrButtons.style.width = "100%"
        squealWrapper.appendChild(hrButtons)

        const editButton = document.createElement("button")
        editButton.addEventListener("click", () => toggleEdit(`wrapper_${squealId}`))
        editButton.innerText = "Modifica"
        editButton.setAttribute("class", "editButton")
        //squealWrapper.appendChild(editButton)

        const deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", () => untoggleEdit(`wrapper_${squealId}`))
        deleteButton.innerText = "Annulla modifiche"
        deleteButton.setAttribute("class", "deleteButton")
        //squealWrapper.appendChild(deleteButton)

        const saveButton = document.createElement("button")
        saveButton.addEventListener("click", () => {
            saveChanges(squealWrapper, squealId)
            untoggleEdit(`wrapper_${squealId}`)
        })
        saveButton.innerText = "Salva modifiche"
        saveButton.setAttribute("class", "saveButton")
        //squealWrapper.appendChild(saveButton)

        // Diamo al pulsante modifica la classe btn btn-primary
        editButton.setAttribute("class",
            editButton.getAttribute("class") + " btn btn-light mt-3 mb-1")
        editButton.setAttribute("style",
            `cursor: pointer;
            box-shadow: 0 0 5px 0 #0000005e;
            border-radius: 10px;
            width: fit-content;
            padding: 5px 20px 5px 20px;
            margin: auto;`)

        // Cambia lo stile del pulsante annulla e salva in modo da renderli simili
        // a quello di modifica, li metto uno di fianco all'altro in un div unico
        deleteButton.setAttribute("class",
            deleteButton.getAttribute("class") + " btn btn-light mt-3 mb-1")
        deleteButton.setAttribute("style",
            `cursor: pointer;
            box-shadow: 0 0 5px 0 #0000005e;
            border-radius: 10px;
            width: fit-content;
            padding: 5px 20px 5px 20px;
            margin: auto;
            display: none;`)
        saveButton.setAttribute("class",
            saveButton.getAttribute("class") + " btn btn-light mt-3 mb-1")
        saveButton.setAttribute("style",
            `cursor: pointer;
            box-shadow: 0 0 5px 0 #0000005e;
            border-radius: 10px;
            width: fit-content;
            padding: 5px 20px 5px 20px;
            margin: auto;
            display: none;`)
        const buttonsDiv = document.createElement("div")
        buttonsDiv.setAttribute("style", "display: flex; justify-content: space-around")
        buttonsDiv.appendChild(editButton)
        buttonsDiv.appendChild(deleteButton)
        buttonsDiv.appendChild(saveButton)
        squealWrapper.appendChild(buttonsDiv)
    


        squealWrapper.setAttribute("id", `wrapper_${squealId}`)


        displayer.appendChild(squealWrapper)

        // Sotto mettiamo un hr

        const hrEnd = document.createElement("hr")
        displayer.appendChild(hrEnd)
    })

}


export async function setSqueals() {
    document.getElementById("squealViewer").innerHTML = ''
    const squeals = await sendSquealFilter()
    displaySqueals(squeals)
}



//assegnazione addEventListener
document.getElementById("sendSquealFilterButton").addEventListener("click", setSqueals)

