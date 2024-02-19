


import { apiUsersURL } from "../urls.mjs";



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


export function toggleEdit(wrapper_id) {
    const userWrapper = document.getElementById(wrapper_id)

    //daily char
    const dailyCharField = document.createElement("input")
    dailyCharField.type = "number"
    dailyCharField.setAttribute("class", "viewer_dailyCharField")

    const dailyCharNumber = userWrapper.querySelector(".viewer_dailyCharNumber")
    const dailyCharRow = dailyCharNumber.parentNode
    replaceNumberWithInput(dailyCharRow, dailyCharField, dailyCharNumber)

    //weekly char
    const weeklyCharField = document.createElement("input")
    weeklyCharField.type = "number"
    weeklyCharField.setAttribute("class", "viewer_weeklyCharField")

    const weeklyCharNumber = userWrapper.querySelector(".viewer_weeklyCharNumber")
    const weeklyCharRow = weeklyCharNumber.parentNode
    replaceNumberWithInput(weeklyCharRow, weeklyCharField, weeklyCharNumber)

    //monthly char
    const monthlyCharField = document.createElement("input")
    monthlyCharField.type = "number"
    monthlyCharField.setAttribute("class", "viewer_monthlyCharField")

    const monthlyCharNumber = userWrapper.querySelector(".viewer_monthlyCharNumber")
    const monthlyCharRow = monthlyCharNumber.parentNode
    replaceNumberWithInput(monthlyCharRow, monthlyCharField, monthlyCharNumber)

    //debt char
    const debtCharField = document.createElement("input")
    debtCharField.type = "number"
    debtCharField.setAttribute("class", "viewer_debtCharField")

    const debtCharNumber = userWrapper.querySelector(".viewer_debtCharNumber")
    const debtCharRow = debtCharNumber.parentNode
    replaceNumberWithInput(debtCharRow, debtCharField, debtCharNumber)

    //blocked checkbox
    const blockedRow = userWrapper.querySelector(".blockedRow")
    blockedRow.style.display = "flex"

    //edit button
    changeEditButtons(userWrapper)
}



export function untoggleEdit(wrapper_id) {
    const userWrapper = document.getElementById(wrapper_id)

    //daily char
    const dailyCharNumber = userWrapper.querySelector(".viewer_dailyCharNumber")
    const dailyCharField = userWrapper.querySelector(".viewer_dailyCharField")
    const dailyCharRow = dailyCharNumber.parentNode
    replaceInputWithNumber(dailyCharRow, dailyCharField, dailyCharNumber)

    //weekly char
    const weeklyCharNumber = userWrapper.querySelector(".viewer_weeklyCharNumber")
    const weeklyCharField = userWrapper.querySelector(".viewer_weeklyCharField")
    const weeklyCharRow = weeklyCharNumber.parentNode
    replaceInputWithNumber(weeklyCharRow, weeklyCharField, weeklyCharNumber)

    //monthly char
    const monthlyCharNumber = userWrapper.querySelector(".viewer_monthlyCharNumber")
    const monthlyCharField = userWrapper.querySelector(".viewer_monthlyCharField")
    const monthlyCharRow = monthlyCharNumber.parentNode
    replaceInputWithNumber(monthlyCharRow, monthlyCharField, monthlyCharNumber)

    //debt char
    const debtCharNumber = userWrapper.querySelector(".viewer_debtCharNumber")
    const debtCharField = userWrapper.querySelector(".viewer_debtCharField")
    const debtCharRow = debtCharNumber.parentNode
    replaceInputWithNumber(debtCharRow, debtCharField, debtCharNumber)

    //blocked checkbox
    const blockedRow = userWrapper.querySelector(".blockedRow")
    blockedRow.style.display = "none"

    //buttons
    changeEditButtons(userWrapper)
}


export async function saveChanges(wrapper, username) {
    const debtCharField = wrapper.querySelector(".viewer_debtCharField")
    const dailyCharField = wrapper.querySelector(".viewer_dailyCharField")
    const weeklyCharField = wrapper.querySelector(".viewer_weeklyCharField")
    const monthlyCharField = wrapper.querySelector(".viewer_monthlyCharField")

    let data = {}

    if (debtCharField.value !== "") {
        data["debtChar"] = debtCharField.value
        wrapper.querySelector(".viewer_debtCharNumber").innerText = debtCharField.value
    } 
    if (dailyCharField.value !== "") {
        data["dailyChar"] = dailyCharField.value
        wrapper.querySelector(".viewer_dailyCharNumber").innerText = dailyCharField.value
    } 
    if (weeklyCharField.value !== "") {
        data["weeklyChar"] = weeklyCharField.value
        wrapper.querySelector(".viewer_weeklyCharNumber").innerText = weeklyCharField.value
    } 
    if (monthlyCharField.value !== "") {
        data["monthlyChar"] = monthlyCharField.value
        wrapper.querySelector(".viewer_monthlyCharNumber").innerText = monthlyCharField.value
    } 
    data["blocked"] = wrapper.querySelector("input[type='checkbox']").checked


    await sendUserUpdateRequest(data, username)

}

async function sendUserUpdateRequest(data, username) {
    const response = await fetch(`${apiUsersURL}/${username}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Errore sendUserUpdateRequest():', error)
    })
}