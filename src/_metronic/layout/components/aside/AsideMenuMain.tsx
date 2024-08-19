/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth';

export function AsideMenuMain() {
  const intl = useIntl()
  const {currentUser, logout} = useAuth();

  console.log('currentUserhgjhghj', currentUser?.designation);
  

  return (
    <div className='ms-2'>
      <AsideMenuItem to='prizePage' icon='message-text-2' title='Leads' />
  
      {/* <AsideMenuItemWithSub to='' title='Settings' icon='setting'>
        <AsideMenuItem to='users' icon='profile-circle' title='User management' />
        <AsideMenuItem to='Role' icon='profile-circle' title='Role Permissions' />
      </AsideMenuItemWithSub> */}
      <AsideMenuItem to='chatPage' icon='message-text-2' title='chats' />

      <AsideMenuItem to='users' icon='profile-circle' title='User management'  />
      {currentUser?.designation == 1 ? 
      <AsideMenuItem  to='Role' icon='profile-circle' title='Role Permissions' />
      : <></> }
    </div>
  )
}
