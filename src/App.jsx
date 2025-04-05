import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./redux/slice/userSlice";
import { Link } from "react-router-dom";
import { User, Mail } from "lucide-react"; // Lucide icons
import RingLoader from "react-spinners/RingLoader";

const App = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <div className="mt-">
        <div className="flex justify-center items-center">
          <img className="w-24" src="/logo.png" alt="" />
        </div>
        <h1 className="text-blue-500 text-xl md:text-2xl font-bold text-center">
          Welcome to the Awura chat box
        </h1>
        <p className="text-blue-500 text-center mb-8">This is the list of available users.</p>

        <div className="max-w-4xl mx-auto my-12">
          {loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-75 z-50">
            <RingLoader
              size={70}
              thickness={200}
              speed={100}
              color="rgba(57, 143, 172, 1)"
            />
          </div>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="space-y-4">
            {users.map((user) => (
              <Link
                to={`/chat/${user.id}`}
                className="text-blue-500 hover:bg-blue-100 dark:bg-slate-800 flex gap-12 flex-col"
              >
                <li
                  key={user.id}
                  className="p-4 bg-white dark:bg-slate-800 dark:hover:bg-blue-950 hover:bg-blue-100 shadow-md rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-300" />
                      <p className="text-sm dark:text-gray-400 text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button>Chat</button>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
