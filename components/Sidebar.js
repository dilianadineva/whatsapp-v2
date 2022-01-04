import styled from "styled-components"
import Avatar from "@mui/material/Avatar"
import ChatIcon from "@mui/icons-material/Chat"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Button, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import * as EmailValidator from "email-validator"
import { db, auth } from "../firebase"
import { signOut } from "firebase/auth"
import { collection, query, where, addDoc, onSnapshot, doc, getDocs} from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { useState } from "react"
import { useEffect } from "react"
import Chat from "./Chat"

const Sidebar = () => {
	const [user] = useAuthState(auth)
	const [chats, setChats] = useState(null)
	const userChatRef = collection(db, "chats")
	useEffect(()=>{
		getChats()
	}, [user])

	let chatAlreadyExists = (recepientEmail, chatsSnapshot) => {
		let exists = false
		chatsSnapshot?.forEach((doc) => {
			if(doc.data().users.find( user => user === recepientEmail)?.length > 0){
				exists = true;
			}
			// return !!doc.data().users.find( user => user === recepientEmail).length > 0 - returns undefined because of the forEach but using some() instead doesn't work for some reason
		});
		return exists
	}

	const getChats = async () => {
		if(user){
			// console.log("user email: ",user.email)
		const userChatQuery = query(collection(db, "chats"), where("users", "array-contains", user?.email));
		const chatsSnapshot = await getDocs(userChatQuery);
		
		let chats = []
		chatsSnapshot.forEach((doc) => {
			// console.log(doc.id, " => ", doc.data());
			let currentchat = {}
			currentchat[doc.id] = doc.data().users
			chats.push(currentchat)
		  });
		  setChats(chats)
		  return chatsSnapshot
		}
	}

	const createChat = async () => {
		const input = prompt("Enter an email for the user you want to chat with", "@gmail.com")
		const userChatQuery = query(userChatRef, where("users", "array-contains", user.email));
		const chatsSnapshot = await getDocs(userChatQuery);
		// const querySnapshot = await getDocs(query(collection(db, "chats"), where("users", "array-contains", user.email))); - the long version
		getChats()
		if (!input) return null //if there was no input

		if (EmailValidator.validate(input) && !chatAlreadyExists(input, chatsSnapshot) && input !== user.email) {
			//add chat into the database 'chats' collection
			const chatsCollectionRef = collection(db, "chats")
			const addChat = async () => {
				const docRef = await addDoc(chatsCollectionRef, {
					users: [user.email, input]
				})
			}
			addChat(); console.log("adding chat");
		}
	}

	return (
		<Container>
			<Header>
				<UserEl>
					<UserAvatar src={user?.photoURL}
						onClick={() => {
							signOut(auth)
								.then(() => {})
								.catch((error) => {
									console.log("error sign out")
								})
						}}
					/>	
					<Logout>logout</Logout>
				</UserEl>
				
				<IconsContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</IconsContainer>
			</Header>
			<Search>
				<SearchIcon />
				<SearchInput />
			</Search>
				<SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
				{/* List of chats */}
				{chats && chats.map((chat)=>{
					return (<Chat key={Object.keys(chat)} id={Object.keys(chat)} users={chat[Object.keys(chat)]} />)
				})}
		</Container>
	)
}

export default Sidebar

const Container = styled.div`
	flex: 0.45;
	border-right: 1px solid whitesmoke;
	height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;
	::-webkit-scrollbar {
    display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`

const IconsContainer = styled.div``
const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
`
const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
`

const SidebarButton = styled(Button)`
	width: 100%;
	&&& {
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
	}
`

const UserAvatar = styled(Avatar)`
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`

const UserEl=styled.div``
const Logout=styled.div`
	display: block;
	visibility: hidden;
	${UserEl}:hover & {
    visibility: visible;
  }
`
