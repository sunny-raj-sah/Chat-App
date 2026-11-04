//  import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { AuthProvider } from "./context/AuthContext";
// import { ChatProvider } from "./context/ChatContext";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Chat from "./pages/Chat";
// import Landing from "./pages/Landing";

// function App() {
//   return (
//     <AuthProvider>
//       <ChatProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route
//               path="/login"
//               element={<Login />}
//             />

//             <Route
//               path="/register"
//               element={<Register />}
//             />

//             <Route
//               path="/chat"
//               element={<Chat />}
//             />
// {/* 
//             <Route
//               path="/"
//               element={
//                 <Navigate
//                   to="/login"
//                   replace
//                 />
//               }
//             /> */}

//               <Route
//               path="/"
//               element={<Landing />}
//             />
//           </Routes>
//         </BrowserRouter>
//       </ChatProvider>
//     </AuthProvider>
//   );
// }

// export default App;

// ----------------------------------------------------------------------------


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

import ProtectedRoute from "./components/ProtectedRoute";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Landing from "./pages/Landing";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<Chat />} />
            </Route>

            {/* Fallback Route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
