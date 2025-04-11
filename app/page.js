'use client';

import CalendarPage from "@/components/calender/CalenderPage";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex justify-between gap-0">
    <Sidebar />
    <CalendarPage />
  </div>
  );
}
