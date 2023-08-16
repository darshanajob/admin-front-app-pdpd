const token = localStorage.getItem('auth-token');
console.log(token)
const accessToken =
  `Bearer ${token}`
//const accessToken = '147|t6OnGbBqvv4UeoXF7yyWMatF5W6d2btAmttVe4lQ'
export default accessToken
