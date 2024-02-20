import React, {useContext, useEffect, useState} from 'react'
import axios from '@root/axiosConfig'
import { channelsURL, apiUsersURL } from '../URLs'
import Form from 'react-bootstrap/Form'
import Feed, { ReactionType } from "@components/Feed/Feed"

import PostPlaceholder from '@components/Post/PostPlaceholder'
import { UserContext } from '@utils/userData'

import { UserDetailsInterface } from "@utils/userData";

export default function TrendingPage() {

    const isLoggedIn = !!localStorage.getItem('token')

    const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }
    //console.log(localStorage.getItem('user'))

    const userToken = localStorage.getItem('token')




    return(
        <>
        <Feed channelName='ALL'/>
        
        </>

    )
}