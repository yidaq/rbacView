import request from '@/utils/request';


export async function getChart() {
    return request('/api/log/chart')
}

export async function getCount() {
    return request('/api/log/count')
}

export async function getLogTable(params) {
    return request('/api/logs', {
        method: 'POST',
        data: { ...params }
    });
}
export async function deleteLogs(params) {
    return request('/api/log', {
        method: 'DELETE',
        data: params.key
    });
}
