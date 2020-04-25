import request from '@/utils/request';

export async function getRouters() {
    return request('/api/permissions/getMenu')
}
export async function getPermissions() {
    return request('/api/permissions/getPermission')
}