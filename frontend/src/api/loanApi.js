const api = `https://quickcredit-webapp-api.herokuapp.com/`

export const applyLoan = ({ amount, tenor, userId, token }) =>
  fetch(`${api}api/v1/loans/${userId}/apply`, {
    method: "POST",
    body: JSON.stringify({ amount, tenor }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const repayLoan = ({ repaymentAmount, loanId, token }) => {
  return fetch(`${api}api/v1/loans/${loanId}/repayment`, {
    method: "POST",
    body: JSON.stringify({ repaymentAmount }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const loadLoans = async ({ token }) =>
  await fetch(`${api}api/v1/loans`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const loadLoan = async ({ userId, token }) =>
  await fetch(`${api}api/v1/loans/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const loadRepaymentHistory = async ({ loanId, token }) =>
  await fetch(`${api}api/v1/loans/${loanId}/repaymentHistory`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const approveOrRejectLoan = ({ loanId, status, token }) =>
  fetch(`${api}api/v1/loans/${loanId}`, {
    method: "POST",
    body: JSON.stringify({ status }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
