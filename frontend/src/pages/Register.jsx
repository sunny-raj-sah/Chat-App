

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
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
      await register(
        form.name,
        form.email,
        form.password
      );

      navigate("/chat");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2>Create Account</h2>

          <p className="text-muted">
            Start chatting with your friends
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
              Name
            </label>

            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Already have an account?{" "}

          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;

// ------------------------------------------------------------------------
// import { useState } from "react";
// import {
//   Link,
//   useNavigate,
// } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// const Register = () => {
//   const navigate = useNavigate();

//   const {
//     register,
//   } = useAuth();

//   const [form, setForm] =
//     useState({
//       name: "",
//       email: "",
//       password: "",
//     });

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
//       await register(
//         form.name,
//         form.email,
//         form.password
//       );

//       navigate("/chat");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Registration failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="text-center mb-4">
//           <h2>Create Account</h2>

//           <p className="text-muted">
//             Start chatting with your friends
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
//               Name
//             </label>

//             <input
//               type="text"
//               name="name"
//               className="form-control"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

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
//               minLength={6}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading
//               ? "Creating..."
//               : "Create Account"}
//           </button>
//         </form>

//         <p className="text-center mt-4 mb-0">
//           Already have an account?{" "}
//           <Link to="/login">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
