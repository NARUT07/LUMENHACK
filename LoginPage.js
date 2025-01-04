// import React from "react";
// import "./LoginPage.css";

// const LoginPage = () => {
//   return (
//     <div className="login-container">
//       <div className="login-layout">
//         {/* Left section */}
//         <div className="login-left">
//           <h1>Welcome to TIMS</h1>
//           <p>Effortlessly manage your telecom inventory with our modern platform.</p>
//         </div>

//         {/* Right section */}
//         <div className="login-right">
//           <div className="login-card">
//             <h2 className="login-header">Login</h2>
//             <form>
//               <div className="mb-3">
//                 <label htmlFor="username" className="form-label">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="username"
//                   placeholder="Enter your username"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="password"
//                   placeholder="Enter your password"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label htmlFor="role" className="form-label">
//                   Login as
//                 </label>
//                 <select className="form-select" id="role">
//                   <option value="admin">Admin</option>
//                   <option value="manager">Manager</option>
//                   <option value="staff">Staff</option>
//                 </select>
//               </div>

//               <button type="submit" className="btn btn-primary">
//                 Login
//               </button>
//             </form>

//             <div className="login-footer">
//               Don't have an account? <a href="/signup">Sign up</a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-layout">
        {/* Left Section */}
        <div className="login-left">
          <h1>Welcome to TIMS</h1>
          <p>Effortlessly manage your telecom inventory with our modern platform.</p>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-header">Login</h2>
            <form>
              {/* Username Field */}
              <div className="mb-3">

              <label htmlFor="username" className="form-label">
                Username
              </label>

                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter your username"
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                />
              </div>

              {/* Role Selection */}
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Login as
                </label>
                <select className="form-select" id="role">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>


              {/* Login Button */}
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              Don't have an account? <a href="/signup">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;