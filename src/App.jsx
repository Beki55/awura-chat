import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./redux/slice/userSlice";
import { Link } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <div className="mt-36">
        <h1 className="text-2xl font-bold text-center">Welcome to the App</h1>
        <p className="text-center mb-8">This is the main page of your application.</p>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Users:</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="p-4 bg-white shadow-md rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link
                  to={`/chat/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Chat
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;