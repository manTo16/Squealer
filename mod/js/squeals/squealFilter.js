import { apiPostsURL } from "../urls.mjs";


function trimFilterIdString(string) {
    return string.replace("filter_", "").replace("Field", "").replace(/_n\d+/, "")
}

export async function sendSquealFilter() {
    let inputValues = {};
    
    inputValues["receiver"] = []

    //querySelectorAll ritorna un oggetto, non un array. quindi converto
    let inputs = Array.from(document.querySelectorAll('.sidebar input[type="text"]'))
    let dateInputs = Array.from(document.querySelectorAll('.sidebar input[type="date"]'))
    let textareas = Array.from(document.querySelectorAll('.sidebar textarea'))
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

    //l'api vuole la @ all'inizio
    if ("sender" in inputValues && !inputValues["sender"].startsWith("@")) inputValues["sender"] = "@" + inputValues["sender"]


    console.log("OUTPUT FUNZIONE", inputValues);

    await fetch(`${apiPostsURL}/mod/search`, {
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
document.getElementById("sendSquealFilterButton").addEventListener("click", sendSquealFilter)

