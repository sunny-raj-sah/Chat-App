

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// const Register = ({ onSwitchToLogin }) => {
//   const navigate = useNavigate();

//   const { register } = useAuth();

//   const [form, setForm] = useState({
//     name: "",
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

//         <form onSubmit={handleSubmit}>
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
//             {loading ? "Creating..." : "Create Account"}
//           </button>
//         </form>

//         <p className="text-center mt-4 mb-0">
//           Already have an account?{" "}

//           <button
//             type="button"
//             className="btn btn-link p-0 align-baseline"
//             onClick={onSwitchToLogin}
//           >
//             Login
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
 
// -------------------------------------------------------------------------

import { useState, useRef } from "react";
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
      await register(
        form.name,
        form.email.trim(),
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
            <label htmlFor="register-name" className="form-label">
              Name <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              id="register-name"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="register-email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>

            <input
              ref={emailRef}
              type="email"
              id="register-email"
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
            <label htmlFor="register-password" className="form-label">
              Password <span className="text-danger">*</span>
            </label>

            <input
              ref={passwordRef}
              type="password"
              id="register-password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handlePasswordKeyDown}
              minLength={6}
              title="Password must contain at least 6 characters."
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
