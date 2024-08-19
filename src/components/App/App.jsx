import React, { createContext, useContext, useEffect, useState } from "react";
// import { BrowserRouter as Route, Link, Routes } from "react-router-dom";
import { AuthContext, db } from "../../index";
import Login from "../Login/Login";
import UserList from "../UserList/UserList";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import DefaultPage from "../DefaultPage/DefaultPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "react-loading-skeleton/dist/skeleton.css";
import UserPage from "../UserPage/UserPage";

export const ContextUser = createContext();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const contextAuth = useContext(AuthContext);
  const { auth, provider } = contextAuth;

  const userList = collection(db, "userList");
  const q = query(userList);
  const [userCollections, loadingUserCollection, error] = useCollectionData(q, {
    idField: "id",
  });

  const signInWithGoogle = async () => {
    try {
      const resp = await signInWithPopup(auth, provider);
      setUser(() => (resp ? resp : null));
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  useEffect(() => {
    const addUserToFirestore = async (resp) => {
      if (loadingUserCollection) {
        console.log("Loading user collections...");
        return;
      }

      if (error) {
        console.error("Error fetching user collections: ", error);
        return;
      }

      if (!userCollections) {
        console.log("User collections are still undefined");
        return;
      }

      console.log(userCollections, "userCollections");

      const userRef = doc(db, "userList", resp.user.uid);

      if (
        resp &&
        !userCollections.some((person) => person.email === resp.user.email)
      ) {
        try {
          await setDoc(userRef, {
            id: resp.user.uid,
            displayName: resp.user.displayName,
            email: resp.user.email,
            photoURL: resp.user.photoURL,
            online: true,
            createdAt: serverTimestamp(),
          });
          console.log("WOOOOOOOOOOW!!!");
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    };

    if (user) {
      addUserToFirestore(user);
    }
  }, [user, loadingUserCollection, error, userCollections]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "userList", user.uid);
        console.log(userRef, "userRef");

        await updateDoc(userRef, {
          online: true,
        });

        // window.addEventListener("unload", handleUnload);

        // return () => {
        //   window.removeEventListener("unload", handleUnload);
        // };
      }
    });

    // Cleanup on component unmount
    return () => {
      unsubscribe();
    };
  }, [auth, user]);

  return (
    <ContextUser.Provider value={{ user, provider }}>
      {/* {user === null && <Navigate to="/" />} */}
      <div className="w-full h-screen flex items-center flex-col">
        {/* <h1>IS LOGGED:</h1> */}
        <NavBar auth={auth} user={user} setUser={setUser} />
        <Routes>
          <Route exact path="/" element={<DefaultPage />} />
          {user === null && (
            <Route
              path="/login"
              element={<Login signInWithGoogle={signInWithGoogle} />}
            />
          )}

          <Route
            path="/chat"
            element={<PrivateRoute user={user} currentUser={user} element={UserList} />}
          />
          <Route
            path="/user-page"
            element={<PrivateRoute user={user} element={UserPage} />}
          />
        </Routes>
      </div>
    </ContextUser.Provider>
  );
};

export default App;
