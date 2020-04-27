import request from '@/utils/request';


export async function getRoleTable(params) {
    return request('/api/roles', {
        method: 'POST',
        data: { ...params }
    })
}
export async function addRoleTable(params) {
    return request('/api/role', {
        method: 'POST',
        data: { ...params }
    })
}
export async function deleteRole(params) {
    return request('/api/role?id=' + `${params.id}`, {
        method: 'Delete',
    });
}
export async function getRoles(params) {
    return request('/api/roleDetail?id=' + `${params.id}`, {
        method: 'POST',
    })
}
export async function updateRole(params) {
    return request('/api/role', {
        method: 'PUT',
        data: { ...params }
    })
}


