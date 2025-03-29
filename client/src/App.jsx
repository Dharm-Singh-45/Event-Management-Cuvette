import React from 'react'
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import PrefrencePage from './pages/PrefrencePage/PrefrencePage.jsx'
import Dashboard from './pages/DashboardPage/Dashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import EventsPage from './pages/EventsPage/EventsPage.jsx'
import BookingPage from './pages/BookingPage/BookingPage.jsx'
import AvailablityPage from './pages/AvailablityPage/AvailablityPage.jsx'
import EditProfilePage from './pages/EditProfilePage/EditProfilePage.jsx'
import CreateNewEvent from './pages/CreateNewEventPage/CreateNewEvent.jsx'
import UpdateEvent from './pages/UpdateEventPage/UpdateEvent.jsx'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/signup" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/preferences" element={<ProtectedRoute><PrefrencePage/></ProtectedRoute>} />
          {/* <Route path="/dashboard" element={<ProtectedRoute><PrefrencePage/></ProtectedRoute> } /> */}
            {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="events" element={<EventsPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="availability" element={<AvailablityPage />} />
          <Route path="settings" element={<EditProfilePage />} />
          <Route path="create" element={<CreateNewEvent />} />
          <Route path="update-events/:eventId" element={<UpdateEvent />} />

        </Route>
         
        </Routes>
      </Router>
    </>
  )
}

export default App
