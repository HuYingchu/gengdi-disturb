import axios from "axios"

function login(data) {
    return axios.post('/api/user/login', data)
        .then((response) => {
            return response.data
        }, (err) => {
            console.error(err)
            throw err
        })
}

function logout() {
    return axios.post("/api/user/logout")
        .then((response) => {
            const resData = response.data;
            return resData.success === true
        }, (err) => {
            console.error(err)
            throw err
        })
}

export {
    login,
    logout
}