import react, {useState, useEffect} from 'react';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import { deleteUsers, getRoles, getUsers, saveUsers, updateUsers } from './core/_requests';
import { toast } from 'react-toastify';
import { PageTitle } from '../../../_metronic/layout/core/PageData';
import { Paginator } from 'primereact/paginator';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [pageData, setPageData] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [UsersForSearch, setUsersForSearch] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [editId, setEditId] = useState<any>({});
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

    const UsersList = async () => {
        setLoading(true);
        const response = await getUsers();
        setUsers(response.output);
        setUsersForSearch(response.output);
        setLoading(false);
    }

    const rolesList = async () => {
        const response = await getRoles();
        setRoles(response.output);
    }

    const initialValues = {
        "first_name": "",
        "email": "",
        "pass": "",
        "password": "",
        "designation": "",
        "phone": "",
        "image": "",
        "address": "",
        "state": ""
    }

    const usersSchema = Yup.object().shape({
        email: Yup.string()
            .email('Wrong email format')
            .required('Email is required'),
        designation: Yup.string()
            .required('Designation is required'),
        name: Yup.string()
            .required('Name is required'),
        phone: Yup.string()
            .required('Name is required')
            .min(7, 'Minimum 7 characters')
            .max(15, 'Maximum 15 characters'),
        pass: Yup.string()
            .required('Password is required')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
        password: Yup.string()
            .required()
            .oneOf([Yup.ref("pass"), ''], "Passwords must match"),
    })

    const usersSchema2 = Yup.object().shape({
        email: Yup.string()
            .email('Wrong email format')
            .required('Email is required'),
        designation: Yup.string()
            .required('Designation is required'),
        first_name: Yup.string()
            .required('Name is required'),
        phone: Yup.string()
            .required('Name is required')
            .min(7, 'Minimum 7 characters')
            .max(15, 'Maximum 15 characters'),
    })

    const isValidFileUploaded=(file:any)=>{
        const validExtensions = ['png','jpeg','jpg']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
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
            (document.getElementById('userProfileImg') as HTMLInputElement).value = '';
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
            (document.getElementById('userProfileImg') as HTMLInputElement).value = '';
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

    const imgRemove = () => {
        setTimeout(() => {
        setImageFile(null);
        setImagePreview('');
        setImgPre(false);
        (document.getElementById('userProfileImg') as HTMLInputElement).value = '';
        }, 500);
    }

    const formik = useFormik({
        initialValues,
        validationSchema: editId && editId.id != undefined ? usersSchema2 : usersSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            const formData = new FormData();
            
            formData.append("first_name",values.first_name);
            formData.append("email",values.email);
            formData.append("pass",values.pass);
            formData.append("password",values.password);
            formData.append("designation",values.designation);
            formData.append("phone",values.phone);
            imageFile && formData.append("image",imageFile);
            !imagePreview && formData.append("image",imageFile!);
            formData.append("address",values.address);
            formData.append("state",values.state);

            let response;
            if(editId && editId.id != undefined) {                
                response = await updateUsers(editId.id, formData)
            } else {
                response = await saveUsers(formData)
            }    

            if(response.status == 200) {
                setLoading(false);
                UsersList();
                resetForm();
                setImageFile(null);
                setImagePreview('');
                setImgPre(false);
                document.getElementById('atom_User_add_modal_close')?.click();
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
            }
          } catch (error) {
            console.error(error)
            toast.error("Somethig went wrong, Please try after sometimes!", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setStatus('Server Error')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })

    const handleDelete = async () => {
        const response = await deleteUsers(deleteId)
        if(response.status == 200) {
            setDeleteId('');
            document.getElementById('atom_User_delete_modal_close')?.click();
            UsersList();
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

    useEffect(() => {
        if(editId && editId.id != undefined) {
            document.getElementById('ejriuwegrbkjy34i23t4873guy2b')?.click();
            editId.image && setImagePreview(process.env.REACT_APP_API_URL+'/uploads/users/image/'+editId.id+'/'+editId.image)
            formik.setFieldValue('first_name', editId.first_name);
            formik.setFieldValue('email', editId.email);
            formik.setFieldValue('pass', '');
            formik.setFieldValue('password', '');
            formik.setFieldValue('designation', editId.designation);
            formik.setFieldValue('phone', editId.phone);
            // formik.setFieldValue('address', editId.address);
            // formik.setFieldValue('state', editId.state);
        }
    }, [editId])

    useEffect(() => {
        if(search.length > 0) {
            const users = UsersForSearch.filter((p) => p.first_name?.toLowerCase().includes(search) || p.phone?.toLowerCase().includes(search) || p.email?.toLowerCase().includes(search) || p.role_name?.toLowerCase().includes(search));
            setUsers(users);
        } else {
            setUsers(UsersForSearch);
        }
    }, [search]);

    useEffect(() => {
        UsersList();
        rolesList();
    }, []);
    
    useEffect(() => {        
        let page = users?.slice(first, first+rows);
        setPageData(page);
    }, [first, rows, users]);

  return (<>
  <PageTitle>User Management</PageTitle>
  <button type="button" className="d-none" data-bs-toggle='modal' data-bs-target='#atom_User_add_modal' id='ejriuwegrbkjy34i23t4873guy2b'>open</button>
    <div className='modal fade' id='atom_User_add_modal' aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static">
      <div className='modal-dialog mw-650px'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0 justify-content-between align-items-center'>
            <div className='text-center'>
              <h3 className='mb-3'>{editId && editId.id != undefined ? "Update User" : "Add User"}</h3>
            </div>
            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='atom_User_add_modal_close' onClick={() => {
                formik.resetForm();
                imgRemove();
                setDeleteId('');
                setSearch('');
                setEditId({});
            }}>
              <KTIcon iconName='cross' className='fs-1' />
            </div>
          </div>
          <div className='modal-body scroll-y pb-10 pt-5'>
            <form noValidate onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-12 mb-3 ">
                        <div className='d-flex justify-content-center'>
                            <label htmlFor={imagePreview ? "" : "image"} className='position-relative'>
                                <input
                                    type="file" onChange={(e) => handleImagePreview(e)}
                                    id="image"
                                    className="form-control d-none"
                                />
                                <div className='prof_img_pre border'>
                                    <img src={imagePreview || toAbsoluteUrl('/media/avatars/blank.png')} className='profile_image w-100'/>
                                    {imagePreview && <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a>}
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label required">Name</label>
                        <div className="input-group first mb-3 input_prepend">
                            <input type="text" {...formik.getFieldProps('first_name')}
                                className="form-control" placeholder="Enter your Name.." />
                        </div>
                        {formik.touched.first_name && formik.errors.first_name && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.first_name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label required">Phone</label>
                        <div className="input-group mb-3 input_prepend">
                            <input type="text" maxLength={15} {...formik.getFieldProps('phone')} onChange={(e) => formik.setFieldValue("phone", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter your Phone Number"/>
                        </div>
                        {formik.touched.phone && formik.errors.phone && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.phone}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label required">Designation</label>
                        <div className="input-group mb-3">
                            <select className='form-select form-select-lg mb-3' {...formik.getFieldProps('designation')}>
                                <option value="">select designation</option>
                                {roles.map((rol, i) => {
                                    return(
                                        <option value={rol.id} key={i} >{rol.role_name}</option>
                                    )
                                })}
                            </select>
                            {/* <input type="text" {...formik.getFieldProps('designation')} className="form-control" placeholder="Enter designation.."/> */}
                        </div>
                        {formik.touched.designation && formik.errors.designation && (
                        <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                                <span role='alert' className='text-danger'>{formik.errors.designation}</span>
                            </div>
                        </div>
                        )}
                    </div>                                                                                                    
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label required">Email</label>
                        <div className="input-group mb-3">
                            <input type="email" {...formik.getFieldProps('email')} className="form-control" placeholder="Enter your email" />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.email}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className={editId && editId.id != undefined ? "form-label" : "form-label required"} >Password</label>
                        <div className="input-group mb-3">
                            <input type="password" {...formik.getFieldProps('pass')} className="form-control" placeholder="Enter your Password" />
                        </div>
                        {formik.touched.pass && formik.errors.pass && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.pass}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className={editId && editId.id != undefined ? "form-label" : "form-label required"} >Confirm Password</label>
                        <div className="input-group mb-3">
                            <input type="password" {...formik.getFieldProps('password')} className="form-control" placeholder="Confirm your Password" />
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.password}</span>
                                </div>
                            </div>
                        )}
                    </div>   
                    {/* <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">Address</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('address')} className="form-control" placeholder="Enter your address" />
                        </div>
                    </div>  
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">State</label>
                        <div className="input-group mb-3">
                            <select className='form-select' {...formik.getFieldProps('state')}>
                                <option value="" >select state</option>
                                {states.map((sta, i) => {
                                    return(
                                        <option value={sta.id} key={i} >{sta.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div> */}
                </div>
                <span className='d-flex justify-content-end'>
                    <button type='button' className='btn btn-sm btn-secondary me-3' data-bs-dismiss='modal' onClick={() => {
                        formik.resetForm();
                        imgRemove();
                        setDeleteId('');
                        setSearch('');
                        setEditId({});
                    }}>Discard</button>
                    <button type='submit' className='btn btn-sm btn-primary'>Save</button>
                </span>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className='modal fade' id='atom_User_delete_modal' aria-hidden='true'>
      <div className='modal-dialog mw-550px'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0 justify-content-between align-items-center'>
            <div className='text-center'>
              <h3 className='mb-3'>Confirmation</h3>
            </div>
            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='atom_User_delete_modal_close'>
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
            <h3 className='mb-sm-0 mb-3'>Users</h3>
            <span className='d-flex'>
                <span className='position-relative me-3'>
                <input onChange={(e) => setSearch(e.target.value?.toLowerCase())}
                className='form-control form-control-sm form-control-solid mw-200px'
                placeholder='Search..'
                /><i className="bi bi-search fs-3 me-3 position-absolute top-25 end-0"></i></span>
                <button className='btn btn-sm btn-primary me-2 text-nowrap' data-bs-toggle='modal' data-bs-target='#atom_User_add_modal' onClick={() => {
                    formik.resetForm();
                    imgRemove();
                    setDeleteId('');
                    setSearch('');
                    setEditId({});
                }}>
                    <i className="bi bi-plus-lg"></i> Add User
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
                        <th>Image</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Designation</th>
                        <th>Phone</th>
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-gray-600 fw-bold'>
                    {users.length > 0 ? pageData.map((item, i) => {
                    return(
                    <tr key={i}>
                        <td>{i+1+first}</td>
                        <td className='py-1'>
                            <div className='prof_img_pre_list border'>
                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={process.env.REACT_APP_API_URL+'/uploads/users/image/'+item.id+'/'+item.image || toAbsoluteUrl('/media/avatars/blank.png')} className='profile_image w-100'/>
                            </div>
                        </td>
                        {/* <td className='d-flex flex-colum    n'>
                            <span>{item.name}</span>
                            <small>{item.email}</small>
                        </td> */}
                        <td><span>{item.first_name}</span></td>
                        <td><span>{item.email}</span></td>
                        <td><span>{item.role_name}</span></td>
                        <td><span>{item.phone}</span></td>
                        <td className='text-center text-nowrap'>                            
                            <button className='btn btn-sm btn-secondary btn-active-color-primary btn-icon me-2' onClick={() => {
                                setEditId(item);
                                }}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                            {item.id != 1 &&
                            <button className='btn btn-sm btn-secondary btn-active-color-danger btn-icon' data-bs-toggle='modal' data-bs-target='#atom_User_delete_modal' onClick={() => setDeleteId(item.id)}>
                                <i className="bi bi-trash"></i>
                            </button>}
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
                    totalRecords={users.length}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    </div>}
    </>)
}

export default Users;
