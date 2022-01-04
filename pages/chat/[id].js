import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore'
import Head from 'next/head'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import { auth, db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useRouter } from 'next/router'

function Chat() {
    const [user] = useAuthState(auth)
    const [chat, setChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        getChats()
        getMessages()
    }, [id])

    const getChats = async () => {
        const chatRef = doc(db, "chats", id);
        const chatRes = await getDoc(chatRef)
            const chat = {
                id: chatRes.id,
                ...chatRes.data()
            }
            setChat(chat)
    }

    const getMessages = async () => {
        const chatSnaphot = doc(db, "chats", id);
        const messagesRef = collection(chatSnaphot, "messages")
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
        const messages = await getDocs(messagesQuery)

        const messagesArray = []
        if(messages){
            messages.forEach(message => {
                messagesArray.push(message.data())
            })
        }
        setMessages(messagesArray)
    }

    return (
        <Container>
            <Head>
                    {chat && ( <title> Chat with {getRecipientEmail(chat.users, user)}</title>)}
            </Head>
            <Sidebar />
            <ChatContainer>
            {chat && messages && ( <ChatScreen chat={chat} messages={messages} /> )}
            </ChatContainer>
        </Container>
    )
}

export default Chat

const Container= styled.div`
    display: flex;
`
const ChatContainer= styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
    display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`
