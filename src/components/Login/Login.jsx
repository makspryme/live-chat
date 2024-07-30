import { useContext } from "react";
import { AuthContext } from "../../index";
import { signInWithPopup } from "firebase/auth";

const Login = ({ signInWithGoogle }) => {
  const AuthContent = useContext(AuthContext);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[300px] h-[400px] bg-slate-200 p-5">
        <h3 className="mx-auto w-max text-2xl">Login</h3>
        <div className="h-full flex justify-center items-center flex-col">
          <button
            className="p-2 bg-slate-500 hover:bg-slate-400 text-white"
            onClick={signInWithGoogle}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
