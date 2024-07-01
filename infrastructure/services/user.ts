import { auth } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const signIn = async (email: string, password: string) => {
  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredentials.user;

  sessionStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const signOutUser = async () => {
  await signOut(auth);
  sessionStorage.removeItem("user");
};

export const registerUser = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};
