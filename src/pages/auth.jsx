import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/slice/userSlice";
import { auth, db } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners"; // Import the loader
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null); // Clear errors when toggling
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Set loading to true when starting the login/register process
    try {
      if (isLogin) {
        // Login with Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const token = await userCredential.user.getIdToken(); // Retrieve the token
        dispatch(loginSuccess({ user: userCredential.user, token })); // Dispatch user and token
        console.log("Token:", token); // Optional: Log the token
        setLoading(false); // Set loading to false after login
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/"); // Navigate to home after login
        }, 3000); // Delay in milliseconds
      } else {
        setLoading(true); // Set loading to true before registration
        // Register with Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const token = await userCredential.user.getIdToken(); // Retrieve the token

        // Save user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date(),
        });

        dispatch(loginSuccess({ user: userCredential.user, token })); // Dispatch user and token
        console.log("Token:", token); // Optional: Log the token
        setLoading(false); // Set loading to false after registration
        toast.success("Register successful!", {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/"); // Navigate to home after login
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false); // Stop loading if there's an error
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist, register them
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
        });
      }

      const token = await user.getIdToken(); // Retrieve the token
      dispatch(loginSuccess({ user, token })); // Dispatch user and token
      console.log("Google Login Token:", token); // Optional: Log the token
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/"); // Navigate to home after login
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error("Google Login Error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-75 z-50">
          <RingLoader
            size={70}
            thickness={200}
            speed={100}
            color="rgba(57, 143, 172, 1)"
          />
        </div>
      )}
      {/* Left Side - Image */}
      <div
        className="w-1/2 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url('/09.jpg')" }}
      ></div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 shadow-lg dark:shadow-slate-600 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Google Login Button */}
          <div
            onClick={handleGoogleLogin}
            className="flex justify-center items-center mt-2 shadow-md p-1 border dark:border-slate-700 rounded-xl cursor-pointer "
          >
            <img className="w-16" src="google.png" alt="google image" />
            <p>Continue With Google</p>
          </div>

          {/* Toggle Button */}
          <p className="text-center mt-4 text-sm ">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="text-blue-700 dark:text-blue-200 hover:underline focus:outline-none"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
