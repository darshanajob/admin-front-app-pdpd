//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const USER_LINKS = "/api/getalllinks/";
export const COMMON_LOGIN = "api/login";

//ADMIN
export const REGISTER_ADMIN = "api/registersuper";
export const ADMIN_UPDATE_STATUS = "api/user/enable/disable";
export const ALL_ADMINS = "api/admins";
export const ALL_AGENT_BY_ADMIN = "api/agent/by/super/admin";

// AGENTS
export const REGISTER_AGENT= "api/globalregister";
export const ALL_AGENTS = "api/agents";
export const VERIFY_ADMIN = "api/decrypt";
export const ALL_AGENT_BY_AGENT = "api/agent/by/agent";



// AGENTS
export const REGISTER_AGENTS= "api/registersuper";
// export const ALL_AGENTS = "api/agents";
//cors
export const SANCTUM_URL ="sanctum/csrf-cookie"

//Front app URL
export const FRONT_APP_URL = "http://localhost:3000/dashboard"; //
//student
export const STUDENT_REGISTER = "/api/register";
export const GET_ALL_STUDENTS = "/api/students";
export const GET_ALL_AGENTS = "/api/agents";
export const FILTER_STUDENTS = "/api/filter/student";

//pub
export const GET_ALL_AGENTS_STU_COUNT = "/api/student/allowcate";
export const GET_AGENTS_ALL_STUDENTS = "/api/get/student/by/agent?page=";
export const GET_ADMIN_ALL_STUDENTS = "/api/get/student/by/admin";
export const REGISTER_STUDENTS_ARRAY = "/api/test/studentreg";
export const ALLOCATE_STUDENTS_TO_AGENT = "/api/test/allocate_agent";
export const GET_ALL_BATCHES = "/api/batches/active";


//super admin
export const STUDENT_REGISTER_SUPER = "/api/registersuper";
export const GET_ALL_STUDENTS_SUPER = "/api/students_super?page=";
export const GET_ALL_AGENTS_SUPER = "/api/agents_super";
export const DELETE_STUDENT_SUPER = "/api/students_super/";
export const EDIT_STUDENT_SUPER = "/api/students_super/";
export const GET_NO_AGENT_ALL_STUDENTS = "/api/get/no_agent_all_students/";

//normal admin
export const STUDENT_REGISTER_NORMAL = "/api/registernormal";
export const GET_ALL_STUDENTS_NORMAL = "/api/students_normal?page=";
export const GET_ALL_AGENTS_NORMAL = "/api/agents_normal";
export const DELETE_STUDENT_NORMAL = "/api/students_normal/";
export const EDIT_STUDENT_NORMAL = "/api/students_normal/";

//agent
export const STUDENT_REGISTER_AGENT = "/api/register_agent";
export const GET_ALL_STUDENTS_AGENT = "/api/students_agent?page=";
export const EDIT_STUDENT_AGENT = "/api/students_agent/";

//commissions
export const UPDATE_COMMISSIONS = "/api/commissions/update";
export const GET_COMMISSIONS_BY_AGENT = "/api/personal/commissions";

//payments
export const ALL_PAYMENTS_STUDENT = "/api/student/pending/payment";
//export const VERIFY_PAYMENT = "/api/student/pending/payment/";
export const VERIFY_PAYMENT = "/api/verify/update/";

//Reports
export const ALL_CALL_STUDNET_STATUS_REPORT = "/api/student/report";
export const SORT_REPORT_BY_DATE = "/api/student/report/sort";
export const SORT_REPORT_BY_DATE_CALL_STATUS = "/api/call/status/byagent";
export const ALL_PAYMENTS = "/api/all/payments";
export const ALL_COMMISSIONS = "/api/all/current/month/commissions";
export const ALL_COMMISSIONS_BY_DATE_RANGE = "/api/all/date/range/commissions";
export const FILTER_PAYMENTS_BY_DATE = "/api/date/range/payments";
export const GET_ALL_COMMISSION_TYPES = "/api/commissions";
export const GET_ALL_COMMISSIONS_BY_AGENT = "/api/get/all/commissions";
export const INDIVIDUAL_COMMISSIONS_CURRENT = "/api/get/all/commissions/current";

//courseLink
export const COURSE_LINK = "/api/course/links/";
export const COURSE_LINK_STATUS_CHANGE = "/api/course/links/status/change/";

//batch
export const GET_BATCHES = "/api/batches";
export const ADD_BATCH = "/api/create/batch";
export const UPDATE_STATUS_BATCH = '/api/update/batch/status'
export const SAVE_BATCH_IMAGE = '/api/save/image'
export const GET_BATCH_IMAGE = '/api/get/batch/image'

