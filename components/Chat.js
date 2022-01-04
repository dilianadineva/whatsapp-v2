import { Avatar } from '@mui/material'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { db, auth } from '../firebase'
import getRecipientEmail from '../utils/getRecipientEmail'
import { collection, query, where, onSnapshot, doc, getDocs, getDoc} from "firebase/firestore"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function Chat({id, users}) {
    const [user] = useAuthState(auth)
    const [recipientEmail, setRecipientEmail] = useState('')
    const [recipient, setRecipient] = useState('')
    const router = useRouter() //next js router

    useEffect(() => {
        // console.log("useeffect called")
        const recipientEmail = getRecipientEmail(users, user)
        setRecipientEmail(recipientEmail)
        getRecipientSnapshot()
    }, [user])

    const getRecipientSnapshot = async () => {
        const usersRef = collection(db, "users");
        // console.log("recipient email: ", getRecipientEmail(users, user))
        const q = query(usersRef, where("email", "==", getRecipientEmail(users, user)));
        const recipientSnapshot = await getDocs(q)
        const recipient = recipientSnapshot?.docs?.[0]?.data()
        // console.log("recipient: ", recipient) //onSnapshot?
        setRecipient(recipient)
        return recipient
        // recipientSnapshot.forEach(doc => {
        //     console.log("data: ", doc.data())
        // })
    }

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL}></UserAvatar>
            ) : (
                <UserAvatar>{(recipientEmail.toUpperCase()[0])}</UserAvatar>
            )}
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat


const Container=styled.div`
    display: flex;
    align-items: center;
    cursor:pointer;
    padding: 15px;
    /* if someone has a really long email address, this breaks it to another line */
    word-break: break-word; 
`
const UserAvatar=styled(Avatar)`
    margin: 5px 15px 5px 5px;

`