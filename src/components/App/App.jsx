import React, { createContext, useContext, useEffect, useState } from "react";
// import { BrowserRouter as Route, Link, Routes } from "react-router-dom";
import { AuthContext } from "../../index";
import Login from "../Login/Login";
import Chat from "../Chat/Chat";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { signInWithPopup } from "firebase/auth";
import DefaultPage from "../DefaultPage/DefaultPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

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

  const signInWithGoogle = async () => {
    try {
      const resp = await signInWithPopup(auth, provider);
      setUser(() => (resp ? resp : null));
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  //   console.log(user);

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
            element={<PrivateRoute user={user} element={Chat} />}
          />
        </Routes>
      </div>
    </ContextUser.Provider>
  );
};

export default App;
