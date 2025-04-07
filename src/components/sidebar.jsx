import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../theme/theme";
import { User } from "lucide-react"; // Lucide user icon
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/slice/userSlice";

function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/auth");
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserId = auth.currentUser?.uid;

        if (currentUserId) {
          // Fetch the current user's details from Firestore
          const userDocRef = doc(db, "users", currentUserId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCurrentUser({
              id: currentUserId,
              name: userData.name,
              email: userData.email,
            });
          } else {
            console.log("No such user in Firestore!");
          }
        }

        // Fetch all users except the current user
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        const userList = userSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== currentUserId);

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCurrentUser();
  }, []); // Runs only once when the component mounts

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="h-screen dark:bg-slate-900 shadow-md p-4 flex flex-col transition-all">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-x-5 border-b dark:border-slate-500 pb-3">
        <img src="/logo.png" alt="User" className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-lg text-center mt-2 font-bold">
            {currentUser?.name || "Loading..."}
          </h2>
          <span className="text-sm text-gray-500">{currentUser?.email}</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border dark:border-slate-500 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Available Users Section */}
      <div className="font-bold mt-6">Available Users</div>
      <div className="mt-4 flex-grow overflow-y-auto">
        <div className="space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link
                to={`/chat/${user.id}`}
                key={user.id}
                className="p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950 transition-all"
              >
                <User className="w-5 h-5 text-blue-500" />
                <div className="flex flex-col">
                  <span className="font-bold">{user.name}</span>
                  <small className="dark:text-gray-400 text-gray-500">
                    {user.email}
                  </small>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center mt-8 gap-5">
              <img className="max-w-36" src="/null.svg" alt="" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No users found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex gap-8 justify-center items-center mt-4">
        <button
          className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleLogout}
        >
          Logout
        </button>
        <DarkModeToggle />
      </div>
    </aside>
  );
}

export default Sidebar;
