import react, {useState, useEffect} from 'react';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import { deleteLeads, getLeads, saveLeads, updateLeads } from './core/_requests';
import { toast } from 'react-toastify';
import { PageTitle } from '../../../_metronic/layout/core/PageData';
import { Paginator } from 'primereact/paginator';

const Leads = () => {
    const [prize, setprize] = useState<any[]>([]);
    const [pageData, setPageData] = useState<any[]>([]);
    const [prizeForSearch, setprizeForSearch] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [editId, setEditId] = useState('');
    const [search, setSearch] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imageFile, setImageFile] = useState(null);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const prizeList = async () => {
        setLoading(true);
        const response = await getLeads();
        setprize(response.output);
        setprizeForSearch(response.output);
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let prizeName = (document.getElementById('prize_name') as HTMLInputElement).value;
        if(prizeName.length > 0) {
            const formData = new FormData();
            formData.append('image', imageFile!);
            formData.append('name', prizeName);
        const response = await saveLeads(formData)
        if(response.status == 200) {
            (document.getElementById('prize_name') as HTMLInputElement).value = "";
            imgRemove();
            document.getElementById('atom_prize_add_modal_close')?.click();
            prizeList();
            toast.success(response.message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error(response.message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }} else {
            toast.warn('Please Enter prize name..', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        }
    }

    const handleDelete = async () => {
        const response = await deleteLeads(deleteId)
        if(response.status == 200) {
            setDeleteId('');
            document.getElementById('atom_prize_delete_modal_close')?.click();
            prizeList();
            toast.success(response.message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error(response.message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const handleUpdate = async (id) => {
        let prizeName = (document.getElementById('prize_name_update'+id) as HTMLInputElement).value;
        if(prizeName.length > 0) {
            const formData = new FormData();
            imageFile && formData.append('image', imageFile!);
            formData.append('name', prizeName);
            const response = await updateLeads(id, formData)
            if(response.status == 200) {
                setEditId('');
                prizeList();
                toast.success(response.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                setEditId('');
                toast.error(response.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } else {
            toast.warn('Please Enter prize name..', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        }    
    }

    const handleImagePreview = (e:any) => {
        if(e.target.files[0].size > 10485760){
            toast.error("Image size should be below 10MB !", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            (document.getElementById('priceProfileImg') as HTMLInputElement).value = '';
            return;
        } else {
            const file = e.target.files[0];
            if(isValidFileUploaded(file)){
                let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
                let image_as_files:any = e.target.files[0];            
                setImageFile(image_as_files);
                setImagePreview(image_as_base64);
                setImgPre(true);
           } else { 
            (document.getElementById('priceProfileImg') as HTMLInputElement).value = '';
            toast.error("Image should be .jpg, .jpeg and .png only!", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
           }  
        }
    }

    const isValidFileUploaded=(file:any)=>{
        const validExtensions = ['png','jpeg','jpg']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
    }

    const imgRemove = () => {
        setTimeout(() => {
        setImageFile(null);
        setImagePreview('');
        setImgPre(false);
        (document.getElementById('priceProfileImg') as HTMLInputElement).value = '';
        }, 500);
    }

    useEffect(() => {
        if(search.length > 0) {
            const prize = prizeForSearch.filter((p) => p.option_value?.toLowerCase().includes(search));
            setprize(prize);
        } else {
            setprize(prizeForSearch);
        }
    }, [search]);

    useEffect(() => {
        prizeList();
    }, []);
    
    useEffect(() => {        
        let page = prize?.slice(first, first+rows);
        setPageData(page);
    }, [first, rows, prize]);

  return (<>
  <PageTitle>Business Settings</PageTitle>
    <div className='modal fade' id='atom_prize_add_modal' aria-hidden='true'>
      <div className='modal-dialog mw-550px'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0 justify-content-between align-items-center'>
            <div className='text-center'>
              <h3 className='mb-3'>Add Leadss</h3>
            </div>
            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='atom_prize_add_modal_close'>
              <KTIcon iconName='cross' className='fs-1' />
            </div>
          </div>
          <div className='modal-body scroll-y pb-10 pt-5'>
            <form onSubmit={handleSubmit}>
                <input name='prize_name' id="prize_name"
                className='form-control form-control-solid mb-8'
                placeholder='Enter prize Name..'
                />
                <div className="col-12 mb-3 ">
                    <div className='d-flex justify-content-center'>
                        <label htmlFor={imagePreview ? "" : "image"} className='position-relative'>
                            <input
                                type="file" onChange={(e) => handleImagePreview(e)}
                                id="image"
                                className="form-control d-none"
                            />
                            <div className='prof_img_pre border'>
                                {imagePreview ?
                                <img src={imagePreview} className='profile_image w-100'/> : 
                                <p className='h-100 w-100 m-0 d-flex justify-content-center align-items-center bg-gray-300 profile_image'>Image</p>}
                                {imagePreview && <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0 rterterter"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a>}
                            </div>
                        </label>
                    </div>
                </div>
                <span className='d-flex justify-content-end'>
                    <button type='button' className='btn btn-sm btn-secondary me-3' data-bs-dismiss='modal'>Cancel</button>
                    <button type='submit' className='btn btn-sm btn-primary'>Save</button>
                </span>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className='modal fade' id='atom_prize_delete_modal' aria-hidden='true'>
      <div className='modal-dialog mw-550px'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0 justify-content-between align-items-center'>
            <div className='text-center'>
              <h3 className='mb-3'>Confirmation</h3>
            </div>
            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='atom_prize_delete_modal_close'>
              <KTIcon iconName='cross' className='fs-1' />
            </div>
          </div>
          <div className='modal-body scroll-y pb-10'>
            <p>Are you sure want to delete?</p>
            <span className='d-flex justify-content-end'>
                <button type='button' className='btn btn-sm btn-secondary me-3' data-bs-dismiss='modal'>No</button>
                <button type='submit' className='btn btn-sm btn-primary' onClick={() => handleDelete()}>Yes</button>
            </span>
          </div>
        </div>
      </div>
    </div>
    {loading ?
    <div className='w-100 h-100'>
        <div className='d-flex justify-content-center flex-column align-items-center h-100'>
            <div className="spinner-border taskloader" role="status">                                    
                <span className="sr-only">Loading...</span>
            </div>
        </div> 
    </div> :
    <div className='card'>
        <div className='card-header d-flex align-items-center mobile-padding'>
            <h3 className='mb-sm-0 mb-3'>Leadss</h3>
            <span className='d-flex'>
                <span className='position-relative me-3'>
                <input onChange={(e) => setSearch(e.target.value?.toLowerCase())}
                className='form-control form-control-sm form-control-solid mw-200px'
                placeholder='Search..'
                /><i className="bi bi-search fs-3 me-3 position-absolute top-25 end-0"></i></span>
                <button className='btn btn-sm btn-primary me-2 text-nowrap' data-bs-toggle='modal' data-bs-target='#atom_prize_add_modal' onClick={() => {
                    (document.getElementById('prize_name') as HTMLInputElement).value = "";
                    setDeleteId('');
                    setSearch('');
                    setEditId('');
                    imgRemove();
                }}>
                    <i className="bi bi-plus-lg"></i> Add Leadss
                </button>
            </span>
        </div>
        <div className='card-body pt-0'>
            <div className='overflow-x-auto'>
            <table
                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' >
                <thead>
                    <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                        <th>Sl.No</th>
                        <th>Leads Image</th>
                        <th>Leads Name</th>
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-gray-600 fw-bold'>
                    {prize.length > 0 ? pageData.map((item, i) => {
                    return(
                    <tr key={i}>
                        <td>{i+1+first}</td>
                        <td className='py-1'>
                        {editId == item.id ?                             
                            <div className='d-flex'>
                                <label htmlFor={imagePreview ? "" : "image"} className='position-relative'>
                                    <input
                                        type="file" onChange={(e) => handleImagePreview(e)}
                                        id="image"
                                        className="form-control d-none"
                                    />
                                    <div className='prof_img_pre_list border'>
                                        {imagePreview ?
                                        <img src={imagePreview} className='profile_image w-100'/> : 
                                        <p className='h-100 w-100 m-0 d-flex justify-content-center align-items-center bg-gray-300 profile_image'>Image</p>}
                                        {imagePreview && <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-5 rounded bg-gray border-0 rterterter"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a>}
                                    </div>
                                </label>
                            </div> : <div className='prof_img_pre_list border d-flex align-items-center'>
                            {item.image ? 
                                <img src={process.env.REACT_APP_API_URL+'/uploads/masters/image/'+item.id+'/'+item.image} className='profile_image w-100'/> : 
                                <p className='h-100 w-100 d-flex justify-content-center align-items-center bg-gray-300 mb-0'>Image</p>}
                            </div>}
                        </td>
                        <td>
                        {editId == item.id ? 
                            <input name='prize_name_update' defaultValue={item.name} id={"prize_name_update"+item.id}
                            className='form-control form-control-solid'
                            placeholder='Enter prize Name..'
                            /> : <span>{item.name}</span>}
                        </td>
                        <td className='text-center text-nowrap'>
                            {editId == item.id ? <>
                            <button className='btn btn-sm btn-secondary btn-active-color-primary btn-icon me-2' onClick={() => handleUpdate(item.id)}>
                                <i className="bi bi-check-lg fs-3"></i>
                            </button>
                            <button className='btn btn-sm btn-secondary btn-active-color-danger btn-icon me-2' onClick={() => setEditId('')}>
                                <i className="bi bi-x-lg fs-4"></i>
                            </button></> : <>
                            <button className='btn btn-sm btn-secondary btn-active-color-primary btn-icon me-2' onClick={() => {
                                setEditId(item.id);
                                setImagePreview(process.env.REACT_APP_API_URL+'/uploads/masters/image/'+item.id+'/'+item.image);
                                }}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className='btn btn-sm btn-secondary btn-active-color-danger btn-icon' data-bs-toggle='modal' data-bs-target='#atom_prize_delete_modal' onClick={() => setDeleteId(item.id)}>
                                <i className="bi bi-trash"></i>
                            </button></>}
                        </td>
                    </tr>)}) : 
                    <tr>
                        <td colSpan={7}>
                        <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                            No matching records found
                        </div>
                        </td>
                    </tr>}
                </tbody>
            </table>
            </div>
            <div className='table_paginator mt-3 d-flex justify-content-end'>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={prize.length}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    </div>}
    </>)
}

export default Leads;
