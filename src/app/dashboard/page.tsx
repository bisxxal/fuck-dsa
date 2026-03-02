'use client'
import Link from "next/link"

 
const DashboardPage = () => {
  return (
    <div className=" bg-green-500 text-white">
        <h1>Dashboard</h1>

        <Link href="/">Home</Link>
    </div>
  )
}

export default DashboardPage