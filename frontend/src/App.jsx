import { BrowserRouter, Routes, Route } from "react-router-dom";
import FakeAppTriage from "./pages/FakeAppTriage";
import UploadScan from "./pages/UploadScan";
import AdminDashboard from "./pages/AdminDashboard";
import ScanHistory from "./pages/ScanHistory";
import Metrics from "./pages/Metrics";
import GeneratePDF from "./pages/GeneratePDF";
import NavBar from "./components/NavBar";

import "./styles/matrix-theme.css";

export default function App() {
  return (
    <BrowserRouter>
     <NavBar />
      <Routes>
        <Route path="/" element={<FakeAppTriage />} />
        <Route path="/upload" element={<UploadScan />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/history" element={<ScanHistory />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/pdf" element={<GeneratePDF />} />
      </Routes>
    </BrowserRouter>
  );
}
