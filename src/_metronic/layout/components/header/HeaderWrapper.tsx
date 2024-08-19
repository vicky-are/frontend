/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {HeaderToolbar} from './HeaderToolbar'
import { HeaderUserMenu, ThemeModeSwitcher } from '../../../partials'
import {useAuth} from '../../../../app/modules/auth'


export function HeaderWrapper() {
  const {config, classes, attributes} = useLayout()
  const {currentUser} = useAuth()
  const {aside} = config

  return (
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      {/* begin::Brand */}
      <div className='header-brand'>

        {/* begin::Aside toggle */}
        <div className='d-flex align-items-center d-lg-none ms-2' title='Show aside menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-30px h-30px'
            id='kt_aside_mobile_toggle'
          >
            <KTIcon iconName='abstract-14' className='fs-1' />
          </div>
        </div>
        {/* end::Aside toggle */}

        {/* begin::Logo */}
        <Link to='/' className='w-100 d-flex justify-content-center'>
          {/* <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/logo.png')}
            className='h-50px h-lg-65px'
          /> */}
          {/* <span className='text-dark fs-1'>The</span> */}
        </Link>
        {/* end::Logo */}


        {/* begin::Theme mode */}
        <div className='d-flex align-items-center d-lg-none'>
          <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary' />
        </div>
        {/* end::Theme mode */}

        <div className='d-flex align-items-center mx-3 d-lg-none'>
                      {/*begin::Action*/}
                <a
                  href='#'
                  className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-start'
                  data-kt-menu-overflow='false'
                >
                  <div className='symbol symbol-40px'>
                    {/* <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='' />  */}
                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={process.env.REACT_APP_API_URL+'/uploads/users/image/'+currentUser?.id+'/'+currentUser?.image || toAbsoluteUrl('/media/avatars/blank.png')}/>
                  </div>
                </a>

                <HeaderUserMenu />
                {/*end::Action*/}
              </div>


        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-minimize'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
          >
            <KTIcon iconName='exit-left' className='fs-1 me-n1 minimize-default' />
            <KTIcon iconName='entrance-left' className='fs-1 minimize-active' />
          </div>
        )}

        {/* begin::Aside toggle */}
        {/* <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-30px h-30px'
            id='kt_aside_mobile_toggle'
          >
            <KTIcon iconName='abstract-14' className='fs-1' />
          </div>
        </div> */}
        {/* end::Aside toggle */}
      </div>
      {/* end::Brand */}
      <HeaderToolbar />
    </div>
  )
}
