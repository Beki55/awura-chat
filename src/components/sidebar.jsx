import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { Link } from "react-router-dom";
import DarkModeToggle from "../layout/theme";

function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUserId = auth.currentUser?.uid;

        // Set current user details
        setCurrentUser({
          id: currentUserId,
          name: auth.currentUser?.displayName || "Anonymous",
          email: auth.currentUser?.email,
        });

        // Fetch all users from Firestore
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        // Map users and exclude the current user
        const userList = userSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== currentUserId); // Exclude current user

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <aside className="h-screen shadow-md p-4 flex flex-col transition-all">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-x-5 border-b pb-3">
        <img
          src="https://via.placeholder.com/50"
          alt="User"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentUser?.name || "Loading..."}
          </h2>
          <span className="text-sm text-gray-500">{currentUser?.email}</span>
        </div>
      </div>

      {/* Search Box */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search"
          aria-label="Search chat"
          className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Available Users Section */}
      <div className="font-bold mt-6">Available Users</div>
      <div className="mt-4 flex-grow overflow-y-auto">
        <div className="space-y-3">
          {users.map((user) => (
            <Link
              to={`/chat/${user.id}`}
              key={user.id}
              className="p-3 rounded-lg flex flex-col cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
              <small className="text-gray-500">{user.email}</small>
            </Link>
          ))}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="mt-4">
        <DarkModeToggle />
      </div>
    </aside>
  );
}

export default Sidebar;