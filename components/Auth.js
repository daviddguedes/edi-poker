import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../firebase/app';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

export default function Auth() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: '3rem',
          backgroundColor: '#e6e6e6',
          textAlign: 'center',
          borderRadius: '20px'
        }}
      >
        <h4>EDI POKER</h4>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    </div>
  )
}
