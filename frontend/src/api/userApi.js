const api = `https://quickcredit-webapp-api.herokuapp.com/`

export const loadUsers = ({ token }) =>
         fetch(`${api}api/v1/auth/users`, {
           method: "GET",
           headers: {
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
           },
         })

export const loadUser = ({ userId, token }) =>
         fetch(`${api}api/v1/auth/users/${userId}`, {
           method: "GET",
             headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
           },
         })

export const verifyUser = ({ email, token }) => (
    fetch(`${api}api/v1/auth/users/${email}/verify`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
);

export const signup = (user) => (
    fetch(`${api}api/v1/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const signin = user => (
    fetch(`${api}api/v1/auth/signin`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);