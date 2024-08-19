import react from 'react'
import { toAbsoluteUrl } from '../../../_metronic/helpers';

const ConstructionPage = () => {
    return(
        <div className='under_construction_page'>
            <span className='under_construction_image_container'>
                <img src={toAbsoluteUrl('/media/underConstruction.png')} className='w-100' alt='img' />
            </span>
        </div>
    )
}

export default ConstructionPage;