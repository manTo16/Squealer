import { apiUsersURL } from "../urls.mjs"

function trimFilterIdString(string) {
    return string.replace("filter_", "").replace("Field", "").replace("Select", "")
}

export async function sendUserFilter() {
    let inputValues = {}

    let inputs = Array.from(document.querySelectorAll('.sidebar input[type="text"]'))
    let selects = Array.from(document.querySelectorAll('.sidebar select'))
    
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

    await fetch(`${apiUsersURL}/mod/search`, {
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
}




//assegnazione addEventListener
document.getElementById("sendUserFilterButton").addEventListener("click", sendUserFilter)