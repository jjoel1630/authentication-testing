import firebase from 'firebase';
import 'firebase/auth';

import { firebaseConfig } from './firebase-config.json';

const app: firebase.app.App = firebase.initializeApp(firebaseConfig);

export default app;
export const auth: firebase.auth.Auth = app.auth();