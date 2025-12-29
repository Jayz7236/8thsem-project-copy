import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Alumni from "./pages/Alumni";
import Events from "./pages/Events";
import Forums from "./pages/Forums";
import Gallery from "./pages/Gallery";
import Discussions from "./pages/Discussions";
import AlumniProfile from "./pages/AlumniProfile";
import CommonProfile from "./pages/CommonProfile";
// Student Components 
import StudentDashboard from "./student/StudentDashboard";

// Admin Components
import AdminDashboard from "./admin/AdminDashboard";
import Alumnilist from "./admin/Alumnilist";
import AlumniVerify from "./admin/AlumniVerify";
import AdminJobs from "./admin/AdminJobs";
import AdminEvents from "./admin/AdminEvents";
import AdminForums from "./admin/AdminForums";
// import View_Forum from "./components/view/View_Forum";
import Profile from "./admin/Profile";
import AdminGallery from "./admin/AdminGallery";
import StudentList from "./admin/StudentList";
import StudentVerify from "./admin/StudentVerify";


// Function to get user from localStorage
const getUser = () => JSON.parse(localStorage.getItem("user")) || null;

// Protected Route for logged-in users
const ProtectedRoute = ({ element }) => {
  const user = getUser();
  return user ? element : <Navigate to="/login" />;
};

// Protected Route for Admin
const AdminRoute = ({ element }) => {
  const user = getUser();
  return user && user.role === "admin" ? element : <Navigate to="/login" />;
};

// Protected Route for Student
const StudentRoute = ({ element }) => {
  const user = getUser();
  return user && user.role === "student" ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute element={<Home />}  />}/>
        <Route path="/about" element={<ProtectedRoute element={<About />}  />}/>
        <Route path="/gallery" element={<ProtectedRoute element={<Gallery />} />} />
        <Route path="/alumni" element={<ProtectedRoute element={<Alumni />} />} />
        <Route path="/alumni/:id" element={<ProtectedRoute element={<CommonProfile />} />} />
        <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
        <Route path="/forums" element={<ProtectedRoute element={<Forums />} />} />
        <Route path="/forums/:id" element={<ProtectedRoute element={<Discussions />} />} />
        <Route path="/jobs" element={<ProtectedRoute element={<Jobs />} />} />
        <Route path="/profile/:id" element={<ProtectedRoute element={<AlumniProfile />} />} />

        {/* Student Protected Routes */}
        <Route path="/student-dashboard" element={<StudentRoute element={<StudentDashboard />} />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/alumni-list" element={<AdminRoute element={<Alumnilist />} />} />
        <Route path="/admin/alumni-verify/:id" element={<AdminRoute element={<AlumniVerify />} />} />
        <Route path="/admin/student-list" element={<AdminRoute element={<StudentList />} />} />
        <Route path="/admin/student-verify/:id" element={<AdminRoute element={<StudentVerify />} />} />
        <Route path="/admin/admin-jobs" element={<AdminRoute element={<AdminJobs />} />} />
        <Route path="/admin/admin-events" element={<AdminRoute element={<AdminEvents />} />} />
        <Route path="/admin/admin-forums" element={<AdminRoute element={<AdminForums />} />} />
        {/* <Route path="/forum/view" element={<AdminRoute element={<View_Forum />}  />} /> */}
        <Route path="/admin/profile" element={<AdminRoute element={<Profile />} />} />
      
        <Route path="/admin/admin-gallery" element={<AdminRoute element={<AdminGallery />} />} />
      </Routes>
    </Router>
  );
}

export default App;
