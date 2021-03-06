import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'
import moment from 'moment'

function Message({user, message}) {
    const [userLoggedIn] = useAuthState(auth)
    const TypeOfMessage = user === userLoggedIn.email ? SenderMessage : RecieverMessage

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>
                {message.timestamp ? moment(message.timestamp).format('LT') : "..."}
                </Timestamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message


const Container=styled.div`
`
const MessageElement=styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
    @media (max-width: 768px) {
        font-size:0.7rem;
        padding-bottom:10px;
        padding-left: 7px;
        padding-right: 7px;
        margin:7px;
        min-width:40px
    }
`

const SenderMessage = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`
const RecieverMessage = styled(MessageElement)`
    text-align:left;
    background-color: white;
`

const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
    @media(max-width: 768px){
        font-size: 7px;
        padding: 3px
    }
`
