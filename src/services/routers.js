import request from '@/utils/request';

export async function getRouters() {
    return request('/api/permissions')
}