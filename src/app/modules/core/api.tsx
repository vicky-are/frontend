import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const CHANGE_PASSWORD_URL = `${API_URL}/auth/change_password`

export function changePassword(data) {
    return axios.put(CHANGE_PASSWORD_URL, data)
    .then(res => res.data)
}