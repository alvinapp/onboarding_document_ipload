import DocUpload from "./components/DocUpload";
import LoginDetails from "./components/LoginDetails";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login-details" element={<LoginDetails />} />
        <Route path="/doc-upload" element={<DocUpload />} />
      </Routes>
    </Router>
  );
}

export default App;