import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='flex h-screen'>
        <Sidebar/>
        <section className='flex flex-1 h-full flex-col'>
        <MobileNavigation/> <Header/>
        <div className='main-content'>
            {children}
        </div>
        </section>
    </main>
  )
}

export default Layout
