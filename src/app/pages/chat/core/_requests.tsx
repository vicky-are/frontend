import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const CHAT_LIST_URL = `${API_URL}/chats/list`
export const CHAT_SAVE_URL = `${API_URL}/chats/save`
export const CHAT_UPDATE_URL = `${API_URL}/chats/update`
export const CHAT_DELETE_URL = `${API_URL}/chats/delete`


//rolls
export function getChat() {
    return axios.get(CHAT_LIST_URL)
    .then(res => res.data)
}

export function saveChat(data) {
    return axios.post(CHAT_SAVE_URL, data)
    .then(res => res.data)
}

export function updateChat(id, data) {
    return axios.put(CHAT_UPDATE_URL+'/'+id, data)
    .then(res => res.data)
}

export function deleteChat(id) {
    return axios.put(CHAT_DELETE_URL+'/'+id)
    .then(res => res.data)
}
