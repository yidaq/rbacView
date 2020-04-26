import request from '@/utils/request';


export async function getPermissionTable() {
    return request('/api/permission/getPermissionTable')
}
export async function addPermission(params) {
    return request('/api/permission/add', {
        method: 'POST',
        data: { ...params },
    });
}
export async function getPermissionMenuTree(params) {
    return request('/api/permission/getMenuTree?type=' + `${params.type}`, {
        method: 'POST',
    });
}
