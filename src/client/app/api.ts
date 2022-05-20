import axios from 'axios';

export function getStores(params) {
  if (params !== "") {
    return axios.get(`/api/stores?${params}`)
  } else {
    return axios.get(`/api/stores`)
  }
}

export function getCsv(params) {
  if (params !== "") {
    return axios.get(`/api/stores/export?${params}`)
  } else {
    return axios.get(`/api/stores/export`)
  }
}

