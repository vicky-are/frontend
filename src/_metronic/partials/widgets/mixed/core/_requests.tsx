import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const DASHBOARD_URL = `${API_URL}/dashboard_registration_count`
// http://localhost:8082/dashboard_registration_count?start_date=2023-10-02&end_date=2023-10-21

//state
export function getDashboardCount(start, end) {
    return axios.get(DASHBOARD_URL+'?start_date='+start+'&end_date='+end)
    .then(res => res.data)
}