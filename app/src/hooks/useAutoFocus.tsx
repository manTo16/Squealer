import { useRef, useEffect } from "react";


/*
https://blog.logrocket.com/how-to-autofocus-using-react-hooks/
ho letto qui che delle volte mettere semplicemente autoFocus non funziona. caso mai non funzionasse potete usare questo
*/

const useAutoFocus = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return inputRef
}

export default useAutoFocus