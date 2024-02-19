import { channelsURL } from "../urls.mjs"

function changeEditButtons(wrapper) {
    const editButton = wrapper.querySelector(".editButton")
    const deleteButton = wrapper.querySelector(".deleteButton")
    const saveButton = wrapper.querySelector(".saveButton")

    if (editButton.style.display === "none") {
        editButton.style.display = "flex"
        deleteButton.style.display = "none"
        saveButton.style.display = "none"
    }
    else {
        editButton.style.display = "none"
        deleteButton.style.display = "flex"
        saveButton.style.display = "flex"
    }
}

function replaceListItemsWithInputs(parentNode) {
    const listItems = parentNode.querySelectorAll("li")

    listItems.forEach(listItem => {
        listItem.style.display = "none"

        const inputNode = document.createElement("input")
        inputNode.setAttribute("value", listItem.innerText)
        parentNode.appendChild(inputNode)
    });
}

function replaceInputsWithListItems(parentNode) {
    const listItems = parentNode.querySelectorAll("li")
    const inputs = parentNode.querySelectorAll("input")

    inputs.forEach( input => parentNode.removeChild(input))

    listItems.forEach(listItem => {
        listItem.style.display = "flex"
    });
}

function createAddOwnerButton(parentNode) {
    const addOwnerButton = document.createElement("button")
    addOwnerButton.innerText = "+"
    addOwnerButton.setAttribute("class", "viewer_addOwnerButton")
    addOwnerButton.addEventListener("click", () => {
        const newInput = document.createElement("input")
        parentNode.appendChild(newInput)
    })
    parentNode.appendChild(addOwnerButton)
}

export function toggleEdit(wrapper_id) {
    const channelWrapper = document.getElementById(wrapper_id)

    //owners
    const ownersUL = channelWrapper.querySelector("ul")
    createAddOwnerButton(ownersUL)
    replaceListItemsWithInputs(ownersUL)

    //edit button
    changeEditButtons(channelWrapper)
}


export function untoggleEdit(wrapper_id) {
    const channelWrapper = document.getElementById(wrapper_id)

    //owners
    const ownersUL = channelWrapper.querySelector("ul")
    if (ownersUL.querySelector(".viewer_addOwnerButton")) ownersUL.removeChild(ownersUL.querySelector(".viewer_addOwnerButton"))
    replaceInputsWithListItems(ownersUL)

    //buttons
    changeEditButtons(channelWrapper)
}

export async function saveChanges(wrapper_id, channelName) {
    const wrapper = document.getElementById(wrapper_id)

    let data = {}

    const ownersUL = wrapper.querySelector("ul")
    const inputs = Array.from(ownersUL.querySelectorAll("input"))
    const inputValues = inputs.filter(input => input.value !== "").map(input => input.value)
    data["usernames"] = {"owners": inputValues}
    ownersUL.innerHTML = ''
    inputValues.forEach(value => {
        const newLI = document.createElement("li")
        newLI.innerText = value
        ownersUL.appendChild(newLI)
    })

    await sendChannelUpdateRequest(data, channelName)
}

async function sendChannelUpdateRequest(data, channelName) {
    const response = await fetch(`${channelsURL}/data/${channelName}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Errore sendChannelUpdateRequest():', error)
    })
}