import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
//不可改
export async function queryCurrent() {
  return request('/api/user/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
//不可改
export async function getUserTable(params) {
  return request('/api/users', {
    method: 'POST',
    data: { ...params }
  });
}
//不可改
export async function addUser(params) {
  return request('/api/user', {
    method: 'POST',
    data: { ...params }
  });
}
//不可改
export async function getUserRoles(params) {
  return request('/api/user/roles?userId=' + `${params.id}`, {
    method: 'POST',
  });
}
//不可改
export async function saveRoles(params) {
  return request('/api/user/roles', {
    method: 'PUT',
    data: { ...params }
  });
}
//不可改
export async function deleteUsers(params) {
  console.log(params)
  return request('/api/user', {
    method: 'DELETE',
    data: params.key
  });
}
export async function updateUser(params) {
  return request('/api/user', {
    method: 'PUT',
    data: { ...params }
  });
}
export async function updateUserOwnInfo(params) {
  return request('/api/user/info', {
    method: 'PUT',
    data: { ...params }
  });
}
export async function updateUserPassword(params) {
  return request('/api/user/pwd', {
    method: 'PUT',
    data: { ...params }
  });
}
export async function getLoginUser() {
  return request('/api/user/loginUsers');
}