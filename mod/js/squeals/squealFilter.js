import { apiPostsURL } from "../urls.mjs";
import { toggleEdit, untoggleEdit, saveChanges } from "./edit.mjs";


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
        const useField = document.getElementById("use_"+(inputId.replace(/_n\d+/, "")))
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


export async function displaySqueals(squealIds) {
    const displayer = document.getElementById("squealViewer")

    squealIds.forEach(async squealId => {
        const squealData = await fetchSquealData(squealId)

        const squealWrapper = document.createElement("div")

        const usernameField = document.createElement("p")
        usernameField.innerText = squealData.username
        squealWrapper.appendChild(usernameField)

        const displayNameField = document.createElement("p")
        displayNameField.innerText = squealData.displayName
        squealWrapper.appendChild(displayNameField)

        const receiversList = document.createElement("ul")
        squealData.receivers.forEach(receiver => {
            const receiverItem = document.createElement("li")
            receiverItem.innerText = receiver
            receiversList.appendChild(receiverItem)
        })
        squealWrapper.appendChild(receiversList)

        const textField = document.createElement("p")
        textField.innerText = squealData.text
        squealWrapper.appendChild(textField)

        const creationDateField = document.createElement("p")
        creationDateField.innerText = squealData.creationDate
        squealWrapper.appendChild(creationDateField)

        const impressionsField = document.createElement("div")
        impressionsField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
            
            const veryLikesField = document.createElement("div")
            veryLikesField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
                const veryLikeIcon = document.createElement("p")
                veryLikeIcon.innerText = "veryLike"
                veryLikesField.appendChild(veryLikeIcon)

                const veryLikeNumber = document.createElement("span")
                veryLikeNumber.setAttribute("class", "viewer_veryLikeNumber")
                veryLikeNumber.innerText = squealData.impressions.veryLikes.number
                veryLikesField.appendChild(veryLikeNumber)

            const likesField = document.createElement("div")
            likesField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
                const likeIcon = document.createElement("p")
                likeIcon.innerText = "like"
                likesField.appendChild(likeIcon)

                const likeNumber = document.createElement("span")
                likeNumber.setAttribute("class", "viewer_likeNumber")
                likeNumber.innerText = squealData.impressions.likes.number
                likesField.appendChild(likeNumber)

            const dislikesField = document.createElement("div")
            dislikesField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
                const dislikeIcon = document.createElement("p")
                dislikeIcon.innerText = "dislike"
                dislikesField.appendChild(dislikeIcon)

                const dislikeNumber = document.createElement("span")
                dislikeNumber.setAttribute("class", "viewer_dislikeNumber")
                dislikeNumber.innerText = squealData.impressions.dislikes.number
                dislikesField.appendChild(dislikeNumber)

            const veryDislikesField = document.createElement("div")
            veryDislikesField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
                const veryDislikeIcon = document.createElement("p")
                veryDislikeIcon.innerText = "veryDislike"
                veryDislikesField.appendChild(veryDislikeIcon)

                const veryDislikeNumber = document.createElement("span")
                veryDislikeNumber.setAttribute("class", "viewer_veryDislikeNumber")
                veryDislikeNumber.innerText = squealData.impressions.veryDislikes.number
                veryDislikesField.appendChild(veryDislikeNumber)
            
        impressionsField.appendChild(veryLikesField)
        impressionsField.appendChild(likesField)
        impressionsField.appendChild(dislikesField)
        impressionsField.appendChild(veryDislikesField)
        squealWrapper.appendChild(impressionsField)

        const editButton = document.createElement("button")
        editButton.addEventListener("click", () => toggleEdit(`wrapper_${squealId}`))
        editButton.innerText = "Modifica"
        editButton.setAttribute("class", "editButton")
        squealWrapper.appendChild(editButton)

        const deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", () => untoggleEdit(`wrapper_${squealId}`))
        deleteButton.innerText = "Annulla modifiche"
        deleteButton.setAttribute("class", "deleteButton")
        deleteButton.style.display = "none"
        squealWrapper.appendChild(deleteButton)

        const saveButton = document.createElement("button")
        saveButton.addEventListener("click", () => {
            saveChanges(squealWrapper, squealId)
            untoggleEdit(`wrapper_${squealId}`)
        })
        saveButton.innerText = "Salva modifiche"
        saveButton.setAttribute("class", "saveButton")
        saveButton.style.display = "none"
        squealWrapper.appendChild(saveButton)

        squealWrapper.setAttribute("style", "border: 1px solid black;")
        squealWrapper.setAttribute("id", `wrapper_${squealId}`)


        displayer.appendChild(squealWrapper)
    })

}


export async function setSqueals() {
    document.getElementById("squealViewer").innerHTML = ''
    const squeals = await sendSquealFilter()
    displaySqueals(squeals)
}



//assegnazione addEventListener
document.getElementById("sendSquealFilterButton").addEventListener("click", setSqueals)

