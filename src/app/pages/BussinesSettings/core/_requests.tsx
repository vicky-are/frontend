import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const LEAD_LIST_URL = `${API_URL}/orgLeads/list`
export const LEAD_SAVE_URL = `${API_URL}/orgLeads/save`
export const LEAD_UPDATE_URL = `${API_URL}/orgLeads/update`
export const LEAD_DELETE_URL = `${API_URL}/orgLeads/delete`

export const GET_ROLE_MANAGEMENT = `${API_URL}/roles/list`


export function getRoleManagementList() {
    return axios.get(GET_ROLE_MANAGEMENT)
    .then((response => response.data))
}

// lead
export function getLeads() {
    return axios.get(LEAD_LIST_URL)
    .then(res => res.data)
}

export function saveLeads(data) {
    return axios.post(LEAD_SAVE_URL, data)
    .then(res => res.data)
}

export function updateLeads(id, data) {
    return axios.put(LEAD_UPDATE_URL+'/'+id, data)
    .then(res => res.data)
}

export function deleteLeads(id) {
    return axios.put(LEAD_DELETE_URL+'/'+id)
    .then(res => res.data)
}