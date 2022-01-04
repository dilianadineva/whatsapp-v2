import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import { useRouter } from 'next/router'
import { Avatar, IconButton } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { collection, query, where, getDocs, orderBy, doc, addDoc, setDoc, serverTimestamp } from "firebase/firestore"
import getRecipientEmail from '../utils/getRecipientEmail'
import { useEffect, useState, useRef } from 'react'
import Message from './Message'
import TimeAgo from "timeago-react"

function ChatScreen({chat, chatmessages}) {
    const router = useRouter() 
    const [user] = useAuthState(auth)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [recipient, setRecipient] = useState({})
    const endOfMessagesRef = useRef(null)

    const getRecipientInfo = async () => {
        const chatsRef = collection(db, "users") 
        const recipientQuery = query(chatsRef, where ("email", "==", getRecipientEmail(chat.users, user)));
        const recipientSnapshot = await getDocs(recipientQuery)
        // console.log("Recipient stuff: ", getRecipientEmail(chat.users, user), recipientSnapshot?.docs?.[0]?.data())
        setRecipient(recipientSnapshot?.docs?.[0]?.data())
        return recipientSnapshot
    }

    const showMessages = async () => {
        const chatSnaphot = doc(db, "chats", router.query.id);
        const messagesRef = collection(chatSnaphot, "messages") 
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
        const messagesSnapshot = await getDocs(messagesQuery)
        const messagesArray = []

        getRecipientInfo()

        if(messagesSnapshot){
            messagesSnapshot.forEach(message => {
                messagesArray.push(message.data())
            })
            // console.log("messagesArray: ", messagesArray)
            setMessages(messagesArray)
        }
        // else{ //get the server side rendered content, fis, above
        //     console.log("ssr")
        //     serversideMessages
        //     serversideMessages.forEach(message => {
        //         messagesArray.push(message.data())
        //     })
        //     // console.log("servr messagesArray: ", messagesArray)
        //     setMessages(messagesArray)
        // }
        scrollToBottom()
    }

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    const sendMessage = async (e) => {
        e.preventDefault()

        const docRef = await addDoc(collection(db, "chats", router.query.id, "messages"), {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
          });

        //update lastseen
        await setDoc(
            doc(db, "users", user.email),
            {
                lastSeen: serverTimestamp(),
            },
            { merge: true }
        )

        setInput('')
        scrollToBottom()
    }

    useEffect(() => {
        showMessages()
    }, [chat, !input])

    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )
                }
                <HeaderInformation>
                <h3>{recipientEmail}</h3>
               {recipient ? 
                (<p>
                    Last active:
                    {' '}
                    {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                    ) : ("unavailable")}
                </p>) : (
                    <p></p>
                )   
            }
                
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {/* show messages portion */}
                { messages.map(message => {
                return (
                    <Message 
                    key={message.id}
                    user={message.user}
                    message={
                        {
                            ...message,
                            timestamp: message.timestamp?.toDate().getTime()
                        }
                    }
                    />
                )
            })}
                {/*autoscroll to bottom of message container(here) when a message is sent */}
                <EndOfMessage ref={endOfMessagesRef} /> 
            </MessageContainer>
            <InputContainer>
            <InsertEmoticonIcon />
            <Input value={input} onChange={(e) => { setInput(e.target.value) }}/>
            <button hidden disabled={!input} type="submit" onClick={sendMessage} >Send Message</button>
            <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container= styled.div`
    /* display: flex; */
`
const Header = styled.div`
 position: sticky;
 display: flex;
 background-color: white;
 z-index: 100;
 top: 0;
 align-items: center;
 padding: 11px;
 height: 80px;
 border-bottom: 1px solid whitesmoke;
`
const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1; /*makes it take up the majority of space and push the icons to the right */
> h3 {
    margin-bottom: 3px;
}
> p {
    font-size: 14px;
    color: gray;
}
`
const HeaderIcons = styled.div``
const MessageContainer = styled.div`
    padding: 30px;
    background-color: whitesmoke;
    min-height: 90vh;
`
const EndOfMessage = styled.div`
    margin-bottom: 10px;
`
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`
const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
    padding: 20px;
`
