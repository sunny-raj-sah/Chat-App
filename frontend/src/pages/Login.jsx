

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        form.email,
        form.password
      );

      navigate("/chat");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2>Welcome Back</h2>

          <p className="text-muted">
            Sign in to continue chatting
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Don't have an account?{" "}

          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={onSwitchToRegister}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

// ------------------------------------------------------------------------------
// import { useState } from "react";
// import {
//   Link,
//   useNavigate,
// } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();

//   const {
//     login,
//   } = useAuth();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] =
//     useState("");

//   const [loading, setLoading] =
//     useState(false);

//   const handleChange = (event) => {
//     setForm({
//       ...form,
//       [event.target.name]:
//         event.target.value,
//     });
//   };

//   const handleSubmit = async (
//     event
//   ) => {
//     event.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       await login(
//         form.email,
//         form.password
//       );

//       navigate("/chat");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="text-center mb-4">
//           <h2>Welcome Back</h2>

//           <p className="text-muted">
//             Sign in to continue chatting
//           </p>
//         </div>

//         {error && (
//           <div className="alert alert-danger">
//             {error}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//         >
//           <div className="mb-3">
//             <label className="form-label">
//               Email
//             </label>

//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">
//               Password
//             </label>

//             <input
//               type="password"
//               name="password"
//               className="form-control"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading
//               ? "Signing in..."
//               : "Login"}
//           </button>
//         </form>

//         <p className="text-center mt-4 mb-0">
//           Don't have an account?{" "}
//           <Link to="/register">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
