import { useContext } from "react";
import { Link } from "react-router-dom";
import { ContextUser } from "../App/App";
import { getAuth, signOut } from "firebase/auth";

const NavBar = ({ user, setUser }) => {
  console.log(user, "context USER");

  const auth = getAuth();

  const logout = async () => {
    try {
      await signOut(auth).then(() => setUser(null));
      localStorage.setItem("user", null);
      // console.log("User Signed Out Successfully!");
    } catch (error) {
      console.log(error.code);
    }
  };
  return (
    <div className="flex justify-end gap-1 h-12 w-full bg-slate-500">
      <div className="flex justify-center gap-5">
        {user ? (
          <>
            <Link
              to="/chat"
              className="flex items-center p-1 bg-slate-500 hover:bg-slate-400 text-white"
            >
              <h2>chat</h2>
            </Link>
            <button
              className="p-1 bg-slate-500 hover:bg-slate-400 text-white"
              onClick={logout}
            >
              <h2> log out</h2>
            </button>
            <div className="w-10 flex items-center border-md overflow-hidden">
              <img src={user.user.photoURL} alt="user" />
            </div>
          </>
        ) : (
          <button
            className="p-1 bg-slate-500 hover:bg-slate-400 text-white"
            onClick={() => {}}
          >
            <Link to="/login">
              <h2>login</h2>
            </Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
