import {FC} from 'react'
import { QRCode } from 'react-qrcode-logo'
import {KTIcon, toAbsoluteUrl} from '../../helpers'

const QRcodeGenerator: FC<any> = (props:any) => {
  const {qRCode} = props;
  return (
        <QRCode value={process.env.REACT_APP_FRONT_URL+"campaigns?cid="+qRCode.campaign_id+"&rid="+qRCode.id} logoImage={process.env.REACT_APP_API_URL+'/uploads/company/logo/'+qRCode.omc_id+'/'+qRCode.omc_logo} removeQrCodeBehindLogo={true} logoPaddingStyle="circle" size={1000} qrStyle="dots" eyeRadius={25} logoPadding={-30} logoWidth={300} />
  )
}

export {QRcodeGenerator}
