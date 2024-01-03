import React from "react";
import Options from "./Options";


interface proSideProps {
    type: string;
}

export default function ProfileSide({
  type
}: proSideProps) {
    if (type === 'profile') {
        return (
            <>
            {/*Feed, con tutti i post dell'utente  */}
            </>
        );
    } else if (type === 'channels') {
        return (
            <>
            {/* Cards con tutti i canali a cui è iscritto */}
            </>
        );
    } else if (type === 'options') {
        return (
            <Options/>
        );
    } else {
        return null;
    }
}