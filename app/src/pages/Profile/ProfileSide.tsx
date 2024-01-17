import React from "react";
import Options from "./Options";
import Feed from "@components/Feed/Feed";
import User from "./User";
import Utente from "./User";


interface proSideProps {
    type: string;
}

export default function ProfileSide({
  type
}: proSideProps) {

    const isLoggedIn = !!localStorage.getItem('token')
    const defaultValue = {}
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue

    if (type === 'profile') {
        return (
            <>
                <Utente/>
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