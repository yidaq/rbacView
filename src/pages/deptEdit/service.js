import request from '@/utils/request';

//获取部门成员
export async function getDeptUsers(params) {
    return request('/api/dept/getUsers?deptId=' + `${params.deptId}`, {
        method: 'POST',
    });
}
//获取部门权限
export async function getDeptPermissions(params) {
    return request('/api/dept/getPermissions?deptId=' + `${params.deptId}`, {
        method: 'POST',
    });
}
//获取部门权限
export async function getDeptInfo(params) {
    return request('/api/dept/deptInfo?deptId=' + `${params.deptId}`, {
        method: 'POST',
    });
}
//获取没有部门的用户
export async function getExtUser() {
    return request('/api/dept/extUser');
}
//新增部门成员
export async function setDeptUser(params) {
    return request('/api/dept/deptUsers', {
        method: 'PUT',
        data: params
    });
}
//新增部门成员
export async function deleteDeptUser(params) {
    return request('/api/dept/deptUsers', {
        method: 'DELETE',
        data: params
    });
}

//获取部门自己资源权限和部门成员资源权限
export async function getDeptOwnPermission(params) {
    return request('/api/depts/ownPermission', {
        method: 'POST',
        data: params
    });
}
