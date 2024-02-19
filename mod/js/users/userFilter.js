import { apiUsersURL } from "../urls.mjs"
import { saveChanges, toggleEdit, untoggleEdit } from "./edit.mjs"

function trimFilterIdString(string) {
    return string.replace("filter_", "").replace("Field", "").replace("Select", "")
}


async function fetchUserData(username) {
    return await fetch(`${apiUsersURL}/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .catch((error) => {
    console.error('errore fetchuserData:', error)
    })
}



export async function sendUserFilter() {
    let inputValues = {}

    let inputs = Array.from(document.querySelectorAll('#sidebarOfPage input[type="text"]'))
    let selects = Array.from(document.querySelectorAll('#sidebarOfPage select'))

    console.log("AAAA", inputs, selects)
    
    inputs.forEach(input => {
        const inputId = input.getAttribute("id")
        const useField = document.getElementById("use_"+(inputId.replace(/_n\d+/, "")))
        const use = useField.checked

        if (use && input.value !== "") 
            inputValues[trimFilterIdString(inputId)] = input.value
    })

    selects.forEach(input => {
        const inputId = input.getAttribute("id")

        if (input.value !== "default")
            inputValues[trimFilterIdString(inputId)] = input.value
    })

    //l'api non vuole la @ all'inizio
    if ("username" in inputValues && inputValues["username"].startsWith("@")) inputValues["username"] = inputValues["username"].slice(1)
    

    console.log("richiesta: ", inputValues)

    const response = await fetch(`${apiUsersURL}/mod/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputValues),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Errore sendUserFilter():', error)
    })

    return response
}


export async function displayUsers(usernames) {
    const displayer = document.getElementById("usersViewer")

    usernames.forEach(async username => {
        const userData = await fetchUserData(username)

        const userWrapper = document.createElement("div")

        const usernameField = document.createElement("p")
        usernameField.setAttribute("class", "viewer_username")
        usernameField.innerText = userData.username
        userWrapper.appendChild(usernameField)

        const displayNameField = document.createElement("p")
        displayNameField.setAttribute("class", "viewer_displayName")
        displayNameField.innerText = userData.displayName
        userWrapper.appendChild(displayNameField)

        const dailyCharField = document.createElement("div")
            dailyCharField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
            const dailyCharLabel = document.createElement("p")
            dailyCharLabel.innerText = "Caratteri giornalieri:"
        dailyCharField.appendChild(dailyCharLabel)
            const dailyCharNumber = document.createElement("span")
            dailyCharNumber.setAttribute("class", "viewer_dailyCharNumber")
            dailyCharNumber.innerText = userData.dailyChar
        dailyCharField.appendChild(dailyCharNumber)
        userWrapper.appendChild(dailyCharField)

        const weeklyCharField = document.createElement("div")
            weeklyCharField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
            const weeklyCharLabel = document.createElement("p")
            weeklyCharLabel.innerText = "Caratteri settimanali:"
        weeklyCharField.appendChild(weeklyCharLabel)
            const weeklyCharNumber = document.createElement("span")
            weeklyCharNumber.setAttribute("class", "viewer_weeklyCharNumber")
            weeklyCharNumber.innerText = userData.weeklyChar
        weeklyCharField.appendChild(weeklyCharNumber)
        userWrapper.appendChild(weeklyCharField)

        const monthlyCharField = document.createElement("div")
            monthlyCharField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
            const monthlyCharLabel = document.createElement("p")
            monthlyCharLabel.innerText = "Caratteri mensili:"
        monthlyCharField.appendChild(monthlyCharLabel)
            const monthlyCharNumber = document.createElement("span")
            monthlyCharNumber.setAttribute("class", "viewer_monthlyCharNumber")
            monthlyCharNumber.innerText = userData.monthlyChar
        monthlyCharField.appendChild(monthlyCharNumber)
        userWrapper.appendChild(monthlyCharField)

        const debtCharField = document.createElement("div")
            debtCharField.setAttribute("style", "display: flex; flex-direction: row; justify-content: space-between;")
            const debtCharLabel = document.createElement("p")
            debtCharLabel.innerText = "Caratteri di debito:"
        debtCharField.appendChild(debtCharLabel)
            const debtCharNumber = document.createElement("span")
            debtCharNumber.setAttribute("class", "viewer_debtCharNumber")
            debtCharNumber.innerText = userData.debtChar
        debtCharField.appendChild(debtCharNumber)
        userWrapper.appendChild(debtCharField)

        const blockedField = document.createElement("div")
        blockedField.setAttribute("class", "blockedRow")
        const blockedCheckbox = document.createElement("input")
        blockedCheckbox.setAttribute("id", `viewer_blocked_${username}`)
        blockedCheckbox.type = "checkbox"
        blockedCheckbox.checked = userData.blocked
        const blockedCheckboxLabel = document.createElement("label")
        blockedCheckboxLabel.setAttribute("for", `viewer_blocked_${username}`)
        blockedCheckboxLabel.innerText = "Utente bloccato"
        blockedField.appendChild(blockedCheckboxLabel)
        blockedField.appendChild(blockedCheckbox)
        blockedField.style.display = "none"
        userWrapper.appendChild(blockedField)

        const editButton = document.createElement("button")
        editButton.addEventListener("click", () => toggleEdit(`wrapper_${userData.username}`))
        editButton.innerText = "Modifica"
        editButton.setAttribute("class", "editButton")
        userWrapper.appendChild(editButton)

        const deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", () => untoggleEdit(`wrapper_${userData.username}`))
        deleteButton.innerText = "Annulla modifiche"
        deleteButton.setAttribute("class", "deleteButton")
        deleteButton.style.display = "none"
        userWrapper.appendChild(deleteButton)

        const saveButton = document.createElement("button")
        saveButton.addEventListener("click", () => {
            saveChanges(userWrapper, username)
            untoggleEdit(`wrapper_${userData.username}`)
        })
        saveButton.innerText = "Salva modifiche"
        saveButton.setAttribute("class", "saveButton")
        saveButton.style.display = "none"
        userWrapper.appendChild(saveButton)

        userWrapper.setAttribute("style", "border: 1px solid black;")
        userWrapper.setAttribute("id", `wrapper_${userData.username}`)

        displayer.appendChild(userWrapper)
    })
}

export async function setUsers() {
    document.getElementById("usersViewer").innerHTML = ''
    const users = await sendUserFilter()
    displayUsers(users)
}


//assegnazione addEventListener
document.getElementById("sendUserFilterButton").addEventListener("click", setUsers)