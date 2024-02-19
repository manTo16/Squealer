import { apiPostsURL } from "../urls.mjs";


function replaceNumberWithInput(parentNode, inputNode, numberNode) {
    numberNode.style.display = "none"
    parentNode.appendChild(inputNode)
}

function replaceInputWithNumber(parentNode, inputNode, numberNode) {
    numberNode.style.display = "flex"
    parentNode.removeChild(inputNode)
}

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
    
    // Inoltre, se trova nel parent un "i", nasconde anche quello
    const i = parentNode.parentNode.querySelector("i")
    if (i) i.style.display = "none"

    listItems.forEach(listItem => {
        listItem.style.display = "none"

        const inputNode = document.createElement("input")
        inputNode.setAttribute("value", listItem.innerText)
        
        inputNode.setAttribute("style", `
        display: block;
        margin: 10px;
        width: 275px;
        `)
        parentNode.appendChild(inputNode)
    });
}

function replaceInputsWithListItems(parentNode) {
    const listItems = parentNode.querySelectorAll("li")
    const inputs = parentNode.querySelectorAll("input")

    // Rimette anche il "i" se c'era e non ci sono listItems
    const i = parentNode.parentNode.querySelector("i")
    if (i && listItems.length == 0) i.style.display = "inline"

    inputs.forEach( input => parentNode.removeChild(input))

    listItems.forEach(listItem => {
        listItem.style.display = "flex"
    });
}

function createAddReceiverButton(parentNode) {
    const addReceiverButton = document.createElement("button")
    addReceiverButton.innerText = "+ | Aggiungi nuovo destinatario"
    addReceiverButton.setAttribute("class", "btn btn-light viewer_addReceiverButton")
    addReceiverButton.setAttribute("style", `
        box-shadow: 0px 0px 2px 0px #00000042;
        border: 1px solid #ced4da;
        margin-top: 6px;
        width: 300px;
    `)
    addReceiverButton.addEventListener("click", () => {
        const newInput = document.createElement("input")
        newInput.setAttribute("style", `
        display: block;
        margin: 10px;
        width: 275px;
        `)
        parentNode.appendChild(newInput)
    })
    parentNode.appendChild(addReceiverButton)
}


export function toggleEdit(wrapper_id) {
    const squealWrapper = document.getElementById(wrapper_id)

    let inputFieldStyles = `
        width: 40%;
    `

    let buttonSty

    //veryLikes
    const veryLikesField = document.createElement("input")
    veryLikesField.type = "number"
    veryLikesField.setAttribute("class", "viewer_veryLikesField")
    veryLikesField.setAttribute("style", inputFieldStyles)

    const veryLikesNumber = squealWrapper.querySelector(".viewer_veryLikeNumber")
    const veryLikesDiv = veryLikesNumber.parentNode
    replaceNumberWithInput(veryLikesDiv, veryLikesField, veryLikesNumber)

    //likes
    const likesField = document.createElement("input")
    likesField.type = "number"
    likesField.setAttribute("class", "viewer_likesField")
    likesField.setAttribute("style", inputFieldStyles)

    const likesNumber = squealWrapper.querySelector(".viewer_likeNumber")
    const likesDiv = likesNumber.parentNode
    replaceNumberWithInput(likesDiv, likesField, likesNumber)

    //dislikes
    const dislikesField = document.createElement("input")
    dislikesField.type = "number"
    dislikesField.setAttribute("class", "viewer_dislikesField")
    dislikesField.setAttribute("style", inputFieldStyles)

    const dislikesNumber = squealWrapper.querySelector(".viewer_dislikeNumber")
    const dislikesDiv = dislikesNumber.parentNode
    replaceNumberWithInput(dislikesDiv, dislikesField, dislikesNumber)

    //veryDislikes
    const veryDislikesField = document.createElement("input")
    veryDislikesField.type = "number"
    veryDislikesField.setAttribute("class", "viewer_veryDislikesField")
    veryDislikesField.setAttribute("style", inputFieldStyles)

    const veryDislikesNumber = squealWrapper.querySelector(".viewer_veryDislikeNumber")
    const veryDislikesDiv = veryDislikesNumber.parentNode
    replaceNumberWithInput(veryDislikesDiv, veryDislikesField, veryDislikesNumber)

    //receivers
    const receiversUL = squealWrapper.querySelector("ul")
    createAddReceiverButton(receiversUL)
    replaceListItemsWithInputs(receiversUL)

    //edit button
    changeEditButtons(squealWrapper)
}


export function untoggleEdit(wrapper_id) {
    const squealWrapper = document.getElementById(wrapper_id)

    //veryLikes
    const veryLikesField = squealWrapper.querySelector(".viewer_veryLikesField")
    const veryLikesNumber = squealWrapper.querySelector(".viewer_veryLikeNumber")
    const veryLikesDiv = veryLikesField.parentNode
    replaceInputWithNumber(veryLikesDiv, veryLikesField, veryLikesNumber)

    //likes
    const likesField = squealWrapper.querySelector(".viewer_likesField")
    const likesNumber = squealWrapper.querySelector(".viewer_likeNumber")
    const likesDiv = likesField.parentNode
    replaceInputWithNumber(likesDiv, likesField, likesNumber)

    //dislikes
    const dislikesField = squealWrapper.querySelector(".viewer_dislikesField")
    const dislikesNumber = squealWrapper.querySelector(".viewer_dislikeNumber")
    const dislikesDiv = dislikesField.parentNode
    replaceInputWithNumber(dislikesDiv, dislikesField, dislikesNumber)

    //veryDislikes
    const veryDislikesField = squealWrapper.querySelector(".viewer_veryDislikesField")
    const veryDislikesNumber = squealWrapper.querySelector(".viewer_veryDislikeNumber")
    const veryDislikesDiv = veryDislikesField.parentNode
    replaceInputWithNumber(veryDislikesDiv, veryDislikesField, veryDislikesNumber)

    //receivers
    const receiversUL = squealWrapper.querySelector("ul")
    if (receiversUL.querySelector(".viewer_addReceiverButton")) receiversUL.removeChild(receiversUL.querySelector(".viewer_addReceiverButton"))
    replaceInputsWithListItems(receiversUL)

    //buttons
    changeEditButtons(squealWrapper)

}

export async function saveChanges(wrapper, postId) {
    const veryLikesField = wrapper.querySelector(".viewer_veryLikesField")
    const likesField = wrapper.querySelector(".viewer_likesField")
    const dislikesField = wrapper.querySelector(".viewer_dislikesField")
    const veryDislikesField = wrapper.querySelector(".viewer_veryDislikesField")

    let data = {}

    if (veryLikesField.value !== "") {
        if (!data["impressions"]) {
            data["impressions"] = {};
        }
        data["impressions"]["veryLikes"] = { "number": veryLikesField.value };
        wrapper.querySelector(".viewer_veryLikeNumber").innerText = veryLikesField.value
    }
    if (likesField.value !== "") {
        if (!data["impressions"]) {
            data["impressions"] = {};
        }
        data["impressions"]["likes"] = { "number": likesField.value };
        wrapper.querySelector(".viewer_likeNumber").innerText = likesField.value
    }
    if (dislikesField.value !== "") {
        if (!data["impressions"]) {
            data["impressions"] = {};
        }
        data["impressions"]["dislikes"] = { "number": dislikesField.value };
        wrapper.querySelector(".viewer_dislikeNumber").innerText = dislikesField.value
    }
    if (veryDislikesField.value !== "") {
        if (!data["impressions"]) {
            data["impressions"] = {};
        }
        data["impressions"]["veryDislikes"] = { "number": veryDislikesField.value };
        wrapper.querySelector(".viewer_veryDislikeNumber").innerText = veryDislikesField.value
    }

    const receiversUL = wrapper.querySelector("ul")
    const inputs = Array.from(receiversUL.querySelectorAll("input"))
    const inputValues = inputs.filter(input => input.value !== "").map(input => input.value)
    data["receivers"] = inputValues
    receiversUL.innerHTML = ''
    inputValues.forEach(value => {
        const newLI = document.createElement("li")
        newLI.innerText = value
        receiversUL.appendChild(newLI)
    })

    await sendSquealUpdateRequest(data, postId)
}


async function sendSquealUpdateRequest(data, postId) {
    const response = await fetch(`${apiPostsURL}/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Errore sendSquealUpdateRequest():', error)
    })
}