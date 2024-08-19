import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const ROLES_LIST_URL = `${API_URL}/roles/list`
export const ROLES_SAVE_URL = `${API_URL}/roles/save`
export const ROLES_UPDATE_URL = `${API_URL}/roles/update`
export const ROLES_DELETE_URL = `${API_URL}/roles/delete`
export const USERS_LIST_URL = `${API_URL}/user/list`
export const USERS_SAVE_URL = `${API_URL}/user/save`
export const USERS_UPDATE_URL = `${API_URL}/user/update`
export const USERS_DELETE_URL = `${API_URL}/user/delete`
export const UPDATE_ROLE_PERMISSIONS = `${API_URL}/roles/update_role_permission`


//rolls
export function getRoles() {
    return axios.get(ROLES_LIST_URL)
    .then(res => res.data)
}

export function saveRoles(data) {
    return axios.post(ROLES_SAVE_URL, data)
    .then(res => res.data)
}

export function updateRoles(id, data) {
    return axios.put(ROLES_UPDATE_URL+'/'+id, data)
    .then(res => res.data)
}

export function deleteRoles(id) {
    return axios.put(ROLES_DELETE_URL+'/'+id)
    .then(res => res.data)
}

//users
export function getUsers() {
    return axios.get(USERS_LIST_URL)
    .then(res => res.data)
}

export function saveUsers(data) {
    return axios.post(USERS_SAVE_URL, data)
    .then(res => res.data)
}

export function updateUsers(id, data) {
    return axios.put(USERS_UPDATE_URL+'/'+id, data)
    .then(res => res.data)
}

export function deleteUsers(id) {
    return axios.put(USERS_DELETE_URL+'/'+id)
    .then(res => res.data)
}

// Delete attendance fetch api
export function updateRolePermission(id: any, body:any) {
    return axios.put(UPDATE_ROLE_PERMISSIONS+'/'+id, body)
    .then((response => response.data))
}