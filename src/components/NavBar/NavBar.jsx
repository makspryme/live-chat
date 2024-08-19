import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ContextUser } from "../App/App";
import { getAuth, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../index";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const NavBar = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    // if (!user) return;
    console.log(user, "user.user.photoURL");
  }, [user]);
  return (
    <div className="flex justify-between items-center gap-1 px-1 h-12 w-full bg-slate-500">
      <p className="text-white font-bold">MESSANGER</p>
      <div className="flex justify-center gap-5 font-medium text-lg">
        {user ? (
          <>
            <Link
              to="/chat"
              className="hidden lg:flex items-center p-1 bg-slate-500 hover:bg-slate-400 text-white rounded-md"
            >
              <h2>Messages</h2>
            </Link>
            <button
              className="hidden lg:block p-1 bg-slate-500 hover:bg-slate-400 text-white rounded-md"
              onClick={async () => {
                console.log(user);
                if (user) {
                  const userRef = doc(db, "userList", user.user.uid);
                  console.log(userRef, "REEEEEff");
                  await updateDoc(userRef, {
                    online: false,
                  });
                }

                logout();
              }}
            >
              <h2>Logout</h2>
            </button>
            <Link
              to="/user-page"
              className="hidden lg:block w-10 flex items-center border-md overflow-hidden rounded-md"
            >
              <img
                src={user.user.photoURL ? user.user.photoURL : ""}
                alt="user"
                referrerpolicy="no-referrer"
              />
            </Link>
            <Dialog
              open={sidebarOpen}
              onClose={setSidebarOpen}
              className="relative z-50 lg:hidden"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
              />

              <div className="fixed inset-0 flex">
                <DialogPanel
                  transition
                  className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                >
                  <TransitionChild>
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                      <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="-m-2.5 p-2.5"
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          aria-hidden="true"
                          className="h-6 w-6 text-white"
                        />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-700 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <p className="text-white font-bold">MESSANGER</p>
                    </div>
                    <nav className="flex flex-1 flex-col gap-2">
                      {user !== null ? (
                        <>
                          <Link
                            to="/user-page"
                            className="w-20 mx-auto border-md overflow-hidden rounded-md"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <img
                              src={user.user.photoURL}
                              alt="user"
                              referrerpolicy="no-referrer"
                            />
                          </Link>
                          <Link
                            to="/chat"
                            className="flex items-center justify-center p-1 bg-slate-500 hover:bg-slate-400 text-white rounded-md"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <h2>Messages</h2>
                          </Link>
                          <button
                            className="p-1 bg-slate-500 hover:bg-slate-400 text-white rounded-md"
                            onClick={async () => {
                              console.log(user);
                              if (user) {
                                const userRef = doc(
                                  db,
                                  "userList",
                                  user.user.uid
                                );
                                console.log(userRef, "REEEEEff");
                                await updateDoc(userRef, {
                                  online: false,
                                });
                              }
                              setSidebarOpen(false);

                              logout();
                            }}
                          >
                            <h2>Logout</h2>
                          </button>
                        </>
                      ) : (
                        <button className="p-1 bg-slate-500 hover:bg-slate-400 text-white rounded-md">
                          <Link to="/login">
                            <h2>Login</h2>
                          </Link>
                        </button>
                      )}
                    </nav>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6 text-white" />
            </button>
          </>
        ) : (
          <button className="p-1 bg-slate-500 hover:bg-slate-400 text-white rounded-md">
            <Link to="/login">
              <h2>Login</h2>
            </Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
