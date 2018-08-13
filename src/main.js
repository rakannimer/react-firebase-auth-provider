import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";

import { renderAndAddProps } from "render-and-add-props";

const firebaseAuthProviderDefaultProps = {
  isSignedIn: false,
  providerId: null,
  user: null
};

const {
  Provider: FirebaseAuthContextProvider,
  Consumer: FirebaseAuthContextConsumer
} = React.createContext(firebaseAuthProviderDefaultProps);
import { initializeFirebaseApp } from "./initialize-firebase-app";

export class FirebaseAuthProvider extends React.PureComponent {
  listenToAuth() {
    this.stopListeningToAuth = firebase
      .app()
      .auth()
      .onAuthStateChanged(user => {
        let authEmission = null;
        if (user === null) {
          authEmission = {
            isSignedIn: false,
            providerId: "none",
            user
          };
        } else if (user.isAnonymous === true) {
          authEmission = {
            isSignedIn: true,
            providerId: "anonymous",
            user
          };
        } else if (user.providerData && user.providerData[0]) {
          authEmission = {
            isSignedIn: true,
            providerId: user.providerData[0].providerId,
            user
          };
        }
        if (authEmission !== null) {
          this.setState(() => authEmission);
        } else {
          console.warn("Something unexpected happened with ", user);
        }
      });
  }
  constructor(props) {
    super(props);
    initializeFirebaseApp(Object.assign({}, props));
    this.state = {
      isSignedIn: false,
      providerId: null,
      user: null
    };
  }
  componentDidMount() {
    this.listenToAuth();
  }

  componentWillUnmount() {
    this.stopListeningToAuth && this.stopListeningToAuth();
  }
  render() {
    const { children } = this.props;
    return (
      <FirebaseAuthContextProvider value={this.state}>
        {renderAndAddProps(children, {})}
      </FirebaseAuthContextProvider>
    );
  }
}

export const FirebaseAuthConsumer = ({ children }) => {
  return (
    <FirebaseAuthContextConsumer>
      {authState => {
        return renderAndAddProps(children, authState);
      }}
    </FirebaseAuthContextConsumer>
  );
};
export const IfFirebaseAuthed = ({ children }) => {
  return (
    <FirebaseAuthContextConsumer>
      {authState => {
        return authState.isSignedIn === true
          ? renderAndAddProps(children, authState)
          : null;
      }}
    </FirebaseAuthContextConsumer>
  );
};

export const IfFirebaseAuthedAnd = ({ children, filter }) => {
  return (
    <FirebaseAuthContextConsumer>
      {authState => {
        return authState.isSignedIn
          ? filter(authState) === true
            ? children
            : null
          : null;
      }}
    </FirebaseAuthContextConsumer>
  );
};

export const IfFirebaseUnAuthed = ({ children }) => {
  return (
    <FirebaseAuthContextConsumer>
      {authState => {
        return authState.isSignedIn === false
          ? renderAndAddProps(children, authState)
          : null;
      }}
    </FirebaseAuthContextConsumer>
  );
};

export const WithFirebase = ({ children }) => {
  return renderAndAddProps(children, { firebase });
};
