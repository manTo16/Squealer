import React from "react";
import Options from "./Options";
import Feed from "@components/Feed/Feed";
import User from "./User";
import Utente from "./User";
import { useNavigate, useParams } from "react-router-dom"


interface proSideProps {
    type: string;
}

export default function ProfileSide({
    type
}: proSideProps) {
    
    const { query } = useParams<{query?: string}>()
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
            <Feed searchQuery={query} searchRoute="search/byUsername" />    
            <h1>A</h1>
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