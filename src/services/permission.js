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
export async function updatePermission(params) {
    return request('/api/permission', {
        method: 'PUT',
        data: { ...params },
    });
}
export async function deletePermission(params) {
    return request('/api/permission?permissionId=' + `${params.id}`, {
        method: 'Delete',
    });
}

