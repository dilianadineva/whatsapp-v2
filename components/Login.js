import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button';
import {db, auth, provider, fbprovider} from '../firebase'
import {signInWithPopup, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";

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
    const signInWithFacebook = () => { 
        signInWithPopup(auth, fbprovider)
        .then((result) => {
            const credential = FacebookAuthProvider.credentialFromResult(result);
             // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const token = credential.accessToken;
            const user = result.user;
            console.log("login user: ", user)
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            console.log("fb error: ", errorCode)
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            console.log("credential error: ", credential)
            // ...
          });
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
                <Button onClick={signIn} variant='outlined'>Sign in with Google</Button>           
                <Button onClick={signInWithFacebook} variant='outlined'>Sign in with Facebook</Button>           
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
