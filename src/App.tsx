import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import MasterControlPage from './components/MasterControl/MasterControlPage';
import { GenerationProvider } from './contexts/GenerationContext';
import MessengerApp from './components/Messenger/MessengerApp';
import PostEditorApp from './components/PostEditor/PostEditorApp';
import BusinessDashboardApp from './components/BusinessDashboard/BusinessDashboardApp';
import FinanceApp from './components/FinanceApp/FinanceApp';
import AnalyticsApp from './components/AnalyticsDashboard/AnalyticsApp';
import BlueAnalyticsApp from './components/BlueAnalytics/BlueAnalyticsApp';
import TikTokCommentsApp from './components/TikTokComments/TikTokCommentsApp';
import YouTubeCommentsApp from './components/YouTubeComments/YouTubeCommentsApp';
import GmailThreadApp from './components/GmailThread/GmailThreadApp';
import HabituationApp from './components/HabituationMock/HabituationApp';
import WebinarGeneratorApp from './components/WebinarGenerator/WebinarGeneratorApp';
import WebinarEditorApp from './components/WebinarEditor/WebinarEditorApp';
import ReviewSliderApp from './components/ReviewSlider/ReviewSliderApp';
import BulkReviewPage from './components/BulkReviews/BulkReviewPage';
import ProfitGrowthApp from './components/ProfitGrowth/ProfitGrowthApp';
import ProfitTableApp from './components/ProfitTable/ProfitTableApp';
import Launchpad from './components/Launchpad';
import './App.css';

function App() {
  return (
    <GenerationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Launchpad />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/master-control" element={<MasterControlPage />} />
          <Route path="/messenger" element={<MessengerApp />} />
          <Route path="/facebook-post" element={<PostEditorApp />} />
          <Route path="/business-dashboard" element={<BusinessDashboardApp />} />
          <Route path="/finance-app" element={<FinanceApp />} />
          <Route path="/analytics-dashboard" element={<AnalyticsApp />} />
          <Route path="/blue-analytics" element={<BlueAnalyticsApp />} />
          <Route path="/tiktok-comments" element={<TikTokCommentsApp />} />
          <Route path="/youtube-comments" element={<YouTubeCommentsApp />} />
          <Route path="/gmail-thread" element={<GmailThreadApp />} />
          <Route path="/habituation-report" element={<HabituationApp />} />
          <Route path="/webinar-generator" element={<WebinarGeneratorApp />} />
          <Route path="/webinar-editor" element={<WebinarEditorApp />} />
          <Route path="/review-slider" element={<ReviewSliderApp />} />
          <Route path="/bulk-reviews" element={<BulkReviewPage />} />
          <Route path="/profit-growth" element={<ProfitGrowthApp />} />
          <Route path="/profit-table" element={<ProfitTableApp />} />
        </Routes>
      </BrowserRouter>
    </GenerationProvider>
  )
}

export default App
