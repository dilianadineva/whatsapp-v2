import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useEffect, useState, useRef } from 'react';
import Message from './Message';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, chatmessages }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [messagesLength, setMessagesLength] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState({});
  const endOfMessagesRef = useRef(null);
  const startOfMessagesRef = useRef(null);

  const getRecipientInfo = async () => {
    const chatsRef = collection(db, 'users');
    const recipientQuery = query(
      chatsRef,
      where('email', '==', getRecipientEmail(chat.users, user))
    );
    const recipientSnapshot = await getDocs(recipientQuery);
    // console.log("Recipient stuff: ", getRecipientEmail(chat.users, user), recipientSnapshot?.docs?.[0]?.data())
    setRecipient(recipientSnapshot?.docs?.[0]?.data());
    return recipientSnapshot;
  };

  const showMessages = async () => {
    if (chatmessages) {
      setMessages(chatmessages);
      setMessagesLength(chatmessages.length);
    } else {
      const chatSnaphot = doc(db, 'chats', router.query.id);
      const messagesRef = collection(chatSnaphot, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
      const messagesSnapshot = await getDocs(messagesQuery);
      const messagesArray = [];
      let length = 0;
      if (messagesSnapshot) {
        messagesSnapshot.forEach((message) => {
          messagesArray.push(message.data());
          length++;
        });
        setMessages(messagesArray);
        setMessagesLength(length);
        if (length > 5) {
          scrollToBottom();
        }else{
          startOfMessagesRef.current.scrollTo(0, 0)
        }
      }
    }
    getRecipientInfo();
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const docRef = await addDoc(
      collection(db, 'chats', router.query.id, 'messages'),
      {
        timestamp: serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      }
    );

    //update lastseen
    await setDoc(
      doc(db, 'users', user.email),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
    setInput('');
    scrollToBottom();
  };

  useEffect(() => {
    showMessages();
  }, [chat, !input, router.query.id]);

  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipient ? (
            <p>
              Last active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'unavailable'
              )}
            </p>
          ) : (
            <p></p>
          )}
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
      <MessageContainer style={{ backgroundImage: 'url(/bgImage.png)' }} ref={startOfMessagesRef}>
        {/* show messages portion */}
        {messages.map((message) => {
          return (
            <Message
              key={message.timestamp.nanoseconds}
              user={message.user}
              message={{
                ...message,
                timestamp: message.timestamp?.toDate().getTime(),
              }}
            />
          );
        })}
        {/*autoscroll to bottom of message container(here) when a message is sent */}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div.attrs({
  'data-id': 'chatscreen-container',
})``;
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
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1; /*makes it take up the majority of space and push the icons to the right */
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
    @media (max-width: 480px) {
      font-size: 10px;
    }
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 10px;
  min-height: 90vh;
`;
const EndOfMessage = styled.div`
  margin-bottom: 5px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  width: 100%;
  /* flex: 1; */
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
  padding: 20px;
  @media (max-width: 480px) {
    margin-left: 5px;
    margin-right: 5px;
  }
`;
