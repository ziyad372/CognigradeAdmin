import "./App.css";
import AddUSer from "./forms/AddUser";
import SideBar from "./components/SideBar";
import LogIn from "./components/LogIn";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";


function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <SideBar />
          <Routes>
            <Route path="/" exact element={<AddUSer />} />
            <Route path="/login" exact element={<LogIn />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
