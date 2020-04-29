import request from '@/utils/request';


export async function getDeptTree() {
    return request('/api/dept/tree')
}
export async function getDeptTreeExId(params) {
    return request('/api/dept/tree?deptId=' + `${params.id}`)
}
export async function getDeptRoles(params) {
    return request('/api/dept/roles?deptId='`${params.id}`, {
        method: 'POST',
    });
}

