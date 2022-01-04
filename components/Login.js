import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button';
import {db, auth, provider} from '../firebase'
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth";

function Login() {
    const signIn = () => { 
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("login user: ", user)
        }).catch(alert
            // (error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // const email = error.email;
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // }
        );
    }
    return (
        <Container>
            <Head>
                <title>
                    Login
                </title>
            </Head>
            <LoginContainer>
                <Logo src="https://mcbconline.org/wp-content/uploads/2020/04/whatsapp-logo.png" />
                {/* <Logo src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1021px-WhatsApp.svg.png" /> */}
                <Button onClick={signIn} variant='outlined'>Sign in with google</Button>           
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container=styled.div`
display: grid;
place-items: center;
height: 100vh;
background-color: #F8F8F8;
`

const LoginContainer=styled.div`
padding: 100px;
display: flex;
flex-direction: column;
background-color: white;
align-items: center; 
border-radius: 5px;
-webkit-box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7); 
box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`

const Logo=styled.img`
height: 200px;
width: 200px;
object-fit:contain;
margin-bottom: 50px;
`
