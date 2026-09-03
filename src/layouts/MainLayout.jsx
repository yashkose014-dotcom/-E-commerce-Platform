import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function MainLayout() {
  return <><AnnouncementBar /><Navbar /><main className="min-h-[70vh]"><Outlet /></main><Footer /></>
}
