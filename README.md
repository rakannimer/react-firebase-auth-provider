# React Firebase Auth

Easily integrate Firebase Authentication in your react(-native) app.

React Firebase Auth exports the following components :

- FirebaseAuthProvider
- FirebaseAuthConsumer
- IfFirebaseAuthed
- IfFirebaseUnAuthed
- WithFirebaseAuthMethods

### Usage

Change PROJECT_NAME to your project name and grab your firebase config here :
https://console.firebase.google.com/project/PROJECT_NAME/settings/general/

```javascript
// Firebase Config
const config = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",

  // OPTIONAL
  databaseURL: "DATABASE_URL",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID"
};
```

Place an AuthProvider Component anywhere in your component tree as an ancestor to any of the other react-firebase-auth-provider components and pass to it your firebase config.

```javascript
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  IfFirebaseUnAuthed,
  IfFirebaseAuthed
} from "react-firebase-auth-provider";

const MyApp = () => {
  return (
    <AuthProvider firebase={firebase} {...config}>
      <div>
        <IfFirebaseUnAuthed>
          <div>You are unauthed ! Authenticate to continue</div>
        </IfFirebaseUnAuthed>
        <IfFirebaseAuthed>
          <div>You are authed !</div>
        </IfFirebaseAuthed>
        <button
          onClick={() => {
            firebase.auth().signInAnonymously();
          }}
        >
          Sign in anonymously
        </button>
        <button
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Sign in anonymously
        </button>
      </div>
    </AuthProvider>
  );
};
```
