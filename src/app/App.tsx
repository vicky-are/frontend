import {Suspense, useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom';
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {ThemeModeProvider} from '../_metronic/partials'
import IdleTimeOutHandler from './sessionTimeoutHandler'


const App = () => {
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)

  let timer2:any = localStorage.getItem('logoutIn') ? localStorage.getItem('logoutIn') : '1';  
  
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <IdleTimeOutHandler 
      timer={timer2}
      onActive={()=>{setIsActive(true)}} 
      onIdle={()=>{setIsActive(false)}}
      onLogout={()=>{setLogout(true)}}
      />
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
