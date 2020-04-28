import request from '@/utils/request';


export async function getDeptTree() {
    return request('/api/dept/tree')
}
export async function getDeptTreeExId(params) {
    return request('/api/dept/tree?deptId=' + `${params.id}`)
}


