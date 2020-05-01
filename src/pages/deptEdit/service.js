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
