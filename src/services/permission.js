import request from '@/utils/request';


export async function getPermissionTable() {
    return request('/api/permission/getPermissionTable')
}
