import {useAuth} from '../../../../app/modules/auth'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, Search} from '../../../partials'

/* eslint-disable jsx-a11y/anchor-is-valid */
const AsideToolbar = () => {
  const {currentUser} = useAuth()

  return (
    <>
      {/*begin::User*/}
      
      {/*end::User*/}

      {/*begin::Aside search*/}
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1'></div>
        </div>
      </div>
      <div className='aside-search py-5 d-none'>
        {/* <?php Theme::getView('partials/search/_inline', array(
        'class' => 'w-100',
        'menu-placement' => 'bottom-start',
        'responsive' => 'false'
    ))?> */}
        <Search />
      </div>
      {/*end::Aside search*/}
    </>
  )
}

export {AsideToolbar}
