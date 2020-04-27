import request from '@/utils/request';


export async function getRoleTable(params) {
    return request('/api/roles', {
        method: 'POST',
        data: { ...params }
    })
}


