import react, {useState, useEffect} from 'react';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers';
import { deleteRoles, getRoles, saveRoles, updateRoles, updateRolePermission} from './core/_requests';
import { toast } from 'react-toastify';
import { PageTitle } from '../../../_metronic/layout/core/PageData';
import { Paginator } from 'primereact/paginator';
import { KTSVG } from '../../../_metronic/helpers';


const Role = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [pageData, setPageData] = useState<any[]>([]);
    const [rolesForSearch, setRolesForSearch] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [editId, setEditId] = useState('');
    const [search, setSearch] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const rolesList = async () => {
        setLoading(true);
        const response = await getRoles();
        setRoles(response.output);
        setRolesForSearch(response.output);
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let roleName = (document.getElementById('role_name') as HTMLInputElement).value;
        if(roleName.length > 0) {
        const response = await saveRoles({role_name: roleName})
        if(response.status == 200) {
            (document.getElementById('role_name') as HTMLInputElement).value = "";
            document.getElementById('atom_role_add_modal_close')?.click();
            rolesList();
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
            toast.warn('Please Enter Role name..', {
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
        const response = await deleteRoles(deleteId)
        if(response.status == 200) {
            setDeleteId('');
            document.getElementById('atom_role_delete_modal_close')?.click();
            rolesList();
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
        let roleName = (document.getElementById('role_name_update'+id) as HTMLInputElement).value;
        
        if(roleName.length > 0) {
            const response = await updateRoles(id, {role_name: roleName})

            if(response.status == 200) {
                setEditId('');
                rolesList();
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
            toast.warn('Please Enter Role name..', {
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
        if(search.length > 0) {
            const roles = rolesForSearch.filter((p) => p.name?.toLowerCase().includes(search));
            console.log("foghiuehtoeirhtpeoirth", roles);
            setRoles(roles);
        } else {
            setRoles(rolesForSearch);
        }
    }, [search]);

    useEffect(() => {
        rolesList();
    }, []);
    
    useEffect(() => {        
        let page = roles?.slice(first, first+rows);
        setPageData(page);
    }, [first, rows, roles]);

  return (<>
  <PageTitle>Role Management</PageTitle>
    <div className='modal fade' id='atom_role_add_modal' aria-hidden='true'>
      <div className='modal-dialog mw-550px'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0 justify-content-between align-items-center'>
            <div className='text-center'>
              <h3 className='mb-3'>Add Role</h3>
            </div>
            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='atom_role_add_modal_close'>
              <KTIcon iconName='cross' className='fs-1' />
            </div>
          </div>
          <div className='modal-body scroll-y pb-10 pt-5'>
            <form onSubmit={handleSubmit}>
                <input name='role_name' id="role_name"
                className='form-control form-control-solid mb-8'
                placeholder='Enter Role Name..'
                />
                <span className='d-flex justify-content-end'>
                    <button type='button' className='btn btn-sm btn-secondary me-3' data-bs-dismiss='modal'>Cancel</button>
                    <button type='submit' className='btn btn-sm btn-primary'>Save</button>
                </span>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div className='modal fade' id='atom_role_delete_modal' aria-hidden='true'>
      <div className='modal-dialog mw-550px'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-0 justify-content-between align-items-center'>
            <div className='text-center'>
              <h3 className='mb-3'>Confirmation</h3>
            </div>
            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='atom_role_delete_modal_close'>
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
        <div className='card-header d-flex align-items-center'>
            <h3>Roles</h3>
            <span className='d-flex'>
                <span className='position-relative me-3'>
                <input onChange={(e) => setSearch(e.target.value?.toLowerCase())}
                className='form-control form-control-sm form-control-solid mw-200px'
                placeholder='Search..'
                /><i className="bi bi-search fs-3 me-3 position-absolute top-25 end-0"></i></span>
                <button className='btn btn-sm btn-primary me-2 text-nowrap' data-bs-toggle='modal' data-bs-target='#atom_role_add_modal' onClick={() => {
                    (document.getElementById('role_name') as HTMLInputElement).value = "";
                    setDeleteId('');
                    setSearch('');
                    setEditId('');
                }}>
                    <i className="bi bi-plus-lg"></i> Add Role
                </button>
            </span>
        </div>
        <div className='card-body pt-0'>
            <table
                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' >
                <thead>
                    <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                        <th>Sl.No</th>
                        {/* <th>Tag</th> */}
                        <th>Role</th>
                        {/* <th>List</th>
                        <th>Save</th>
                        <th>Edit</th>
                        <th>Delete</th> */}
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-gray-600 fw-bold'>
                    {roles.length > 0 ? pageData.map((item, i) => {
                    return(
                    <tr key={i}>
                        <td>{i+1+first}</td>
                        {/* <td>
                            <div className='table_item_preview bg-secondary'>
                                {item.name}
                            </div>
                        </td> */}
                        {/* Edit Name */}
                        <td>
                        {editId == item.id ? 
                            <input name='role_name_update' defaultValue={item.role_name} id={"role_name_update"+item.id}
                            className='form-control form-control-solid'
                            placeholder='Enter Role Name..'
                            /> : <span>{item.role_name}</span>}
                        </td>
                        <td className='text-center'>
                            {editId == item.id ? <>
                            <button className='btn btn-sm btn-secondary btn-active-color-primary btn-icon me-2' onClick={() => handleUpdate(item.id)}>
                                <i className="bi bi-check-lg fs-3"></i>
                            </button>
                            <button className='btn btn-sm btn-secondary btn-active-color-danger btn-icon me-2' onClick={() => setEditId('')}>
                                <i className="bi bi-x-lg fs-4"></i>
                            </button></> : <>
                            <button className='btn btn-sm btn-secondary btn-active-color-primary btn-icon me-2' onClick={() => {
                                setEditId(item.id);
                                }}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button type='button' data-bs-toggle='modal' data-bs-target={'#permissionModel'+item.id} className="btn btn-sm btn-secondary btn-active-color-danger btn-icon me-2" title='permissions'>
                            <KTSVG path="/media/icons/duotune/ecommerce/ecm008.svg" className="svg-icon-muted svg-icon-1" />
                            </button>
                            {item.id != 1 ? 
                            <button className='btn btn-sm btn-secondary btn-active-color-danger btn-icon' data-bs-toggle='modal' data-bs-target='#atom_role_delete_modal' onClick={() => setDeleteId(item.id)}>
                                <i className="bi bi-trash"></i>
                            </button>
                            : <></>}
                            </>
                            }
                        </td>

                        <div className='modal fade' id={'permissionModel' + item.id} aria-hidden='true'>
                            <div className='modal-dialog'>
                                <div className='modal-content'>
                                    <div className='modal-header'>
                                        {/* <th> */}
                                            {editId == item.id ?
                                                <input name='role_name_update' defaultValue={item.name} id={"role_name_update" + item.id}
                                                    className='form-control form-control-solid'
                                                    placeholder='Enter Role Name..'
                                                /> : <span>{item.name}</span>}
                                        {/* </th> */}
                                        <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                        </div>
                                    </div>
                                    <div className='modal-body py-lg-10 px-lg-10'>
                                        <form action="">
                                        <div className="container">
                                            <div className="row justify-content-around bg-gray-200 m-4 p-4">
                                                <div className="col-4">
                                                <h5>List</h5>
                                                </div>
                                                <div className="col-4">
                                                <div className="form-check form-switch col-3">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1" defaultChecked={item.list_ == 1 ? true : false} onChange={async (e) => {
                                                        let body = {
                                                            "module": 'list_',
                                                            "val": e.target.checked ? 1 : 0
                                                        }
                                                        await updateRolePermission(item.id, body)
                                                    }} />
                                                </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-around bg-gray-200 m-4 p-4">
                                                <div className="col-4">
                                                <h5>Save</h5>
                                                </div>
                                                <div className="col-4">
                                                <div className="form-check form-switch col-3">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1" defaultChecked={item.save_ == 1 ? true : false} onChange={async (e) => {
                                                        let body = {
                                                            "module": 'save_',
                                                            "val": e.target.checked ? 1 : 0
                                                        }
                                                        await updateRolePermission(item.id, body)
                                                    }} />
                                                </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-around bg-gray-200 m-4 p-4">
                                                <div className="col-4">
                                                <h5>Edit</h5>
                                                </div>
                                                <div className="col-4">
                                                <div className="form-check form-switch col-3">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1" defaultChecked={item.update_ == 1 ? true : false} onChange={async (e) => {
                                                        let body = {
                                                            "module": 'update_',
                                                            "val": e.target.checked ? 1 : 0
                                                        }
                                                        await updateRolePermission(item.id, body)
                                                    }} />
                                                </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-around bg-gray-200 m-4 p-4">
                                                <div className="col-4">
                                                <h5>Delete</h5>
                                                </div>
                                                <div className="col-4">
                                                <div className="form-check form-switch col-3">
                                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1" defaultChecked={item.delete_ == 1 ? true : false} onChange={async (e) => {
                                                        let body = {
                                                            "module": 'delete_',
                                                            "val": e.target.checked ? 1 : 0
                                                        }
                                                        await updateRolePermission(item.id, body)
                                                    }} />
                                                </div>
                                                </div>
                                            </div>
                                        </div>
    
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

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
            <div className='table_paginator mt-3 d-flex justify-content-end'>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={roles.length}
                    rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    </div>}
    </>)
}

export default Role;
