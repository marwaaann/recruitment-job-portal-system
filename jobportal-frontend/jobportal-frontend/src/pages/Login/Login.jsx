import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import useAuth from "../../hooks/useAuth";




export default function Login() {

    const navigate = useNavigate();

    const { login: loginUser } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

            const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

       const res = await login(email, password);

console.log(res);

loginUser(res);

navigate("/dashboard");

    } catch (err) {

        setError("Invalid Email or Password");

    } finally {

        setLoading(false);

    }

};

    

  return (

    
    <div className="min-h-screen flex">

      {/* Left Side */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white items-center justify-center">

        <div className="max-w-md">

          <h1 className="text-5xl font-bold mb-6">
            Job Portal
          </h1>

          <p className="text-lg opacity-90 leading-8">

            Modern Recruitment Management System

            built for

            Super Admin,

            Admin,

            Client,

            Partner

            and Candidate.

          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex flex-1 justify-center items-center bg-gray-100">

        <form
    onSubmit={handleLogin}
    className="bg-white shadow-2xl rounded-2xl p-10 w-[420px]"
>

          <h2 className="text-3xl font-bold mb-2">

            Welcome Back

          </h2>

          <p className="text-gray-500 mb-8">

            Login to continue

          </p>

          {/* Email */}

          <div className="mb-5">

            <label className="font-semibold">

              Email

            </label>

            <div className="flex items-center border rounded-lg mt-2 px-3">

              <Mail size={18}/>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full p-3 outline-none"
                />

            </div>

          </div>

          {/* Password */}

          <div className="mb-5">

            <label className="font-semibold">

              Password

            </label>

            <div className="flex items-center border rounded-lg mt-2 px-3">

              <Lock size={18}/>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-3 outline-none"
                />

              

            </div>

          </div>

          {
        error && (
            <p className="text-red-500 mb-4"> {error} </p>
        )
    }

         <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
>
    {loading ? "Logging..." : "Login"}
</button>

        </form>

    </div>

</div>
  )
}