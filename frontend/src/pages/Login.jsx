

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// const Login = ({ onSwitchToRegister }) => {
//   const navigate = useNavigate();

//   const { login } = useAuth();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (event) => {
//     setForm({
//       ...form,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {
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

//         <form onSubmit={handleSubmit}>
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
//             {loading ? "Signing in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-center mt-4 mb-0">
//           Don't have an account?{" "}

//           <button
//             type="button"
//             className="btn btn-link p-0 align-baseline"
//             onClick={onSwitchToRegister}
//           >
//             Register
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
//  --------------------------------------------------------------------


import { useState, useRef } from "react";
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

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Validate email format and require .com
  const validateEmail = (value) => {
    const emailRegex =
      /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+com$/i;

    return emailRegex.test(value.trim());
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Clear previous email validation error
  const handleEmailChange = (event) => {
    event.target.setCustomValidity("");

    setForm({
      ...form,
      email: event.target.value,
    });
  };

  // Handle Enter key for Email field
  const handleEmailKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const emailInput = event.currentTarget;

      if (!emailInput.value.trim()) {
        emailInput.reportValidity();
        return;
      }

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      if (!validateEmail(emailInput.value)) {
        emailInput.setCustomValidity(
          "Please enter a valid email address ending with .com"
        );

        emailInput.reportValidity();
        return;
      }

      emailInput.setCustomValidity("");
      passwordRef.current?.focus();
    }
  };

  // Handle Enter key for Password field
  const handlePasswordKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!event.currentTarget.checkValidity()) {
        event.currentTarget.reportValidity();
        return;
      }

      event.currentTarget.form.requestSubmit();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailInput = emailRef.current;

    if (!validateEmail(form.email)) {
      emailInput.setCustomValidity(
        "Please enter a valid email address ending with .com"
      );

      emailInput.reportValidity();
      return;
    }

    emailInput.setCustomValidity("");

    setError("");
    setLoading(true);

    try {
      await login(
        form.email.trim(),
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
            <label htmlFor="login-email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>

            <input
              ref={emailRef}
              type="email"
              id="login-email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleEmailChange}
              onKeyDown={handleEmailKeyDown}
              pattern=".+@.+\.com"
              title="Please enter a valid email address ending with .com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label">
              Password <span className="text-danger">*</span>
            </label>

            <input
              ref={passwordRef}
              type="password"
              id="login-password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handlePasswordKeyDown}
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
