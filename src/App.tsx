import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import CounselingPipeline from './pages/CounselingPipeline';
import LeadProfile from './pages/LeadProfile';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Applications from './pages/Applications';
import VisaProcessing from './pages/VisaProcessing';
import Finance from './pages/Finance';
import Partners from './pages/Partners';
import PartnerProfile from './pages/PartnerProfile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TestPreparation from './pages/TestPreparation';
import BatchProfile from './pages/BatchProfile';
import MyProfile from './pages/MyProfile';
import HelpSupport from './pages/HelpSupport';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="counseling" element={<CounselingPipeline />} />
            <Route path="counseling/:id" element={<LeadProfile />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentProfile />} />
            <Route path="test-preparation" element={<TestPreparation />} />
            <Route path="test-preparation/:id" element={<BatchProfile />} />
            <Route path="applications" element={<Applications />} />
            <Route path="visa-processing" element={<VisaProcessing />} />
            <Route path="finance" element={<Finance />} />
            <Route path="partners" element={<Partners />} />
            <Route path="partners/:id" element={<PartnerProfile />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="help-support" element={<HelpSupport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
