import request from '@/utils/request';


export async function getDeptTree() {
    return request('/api/dept/tree')
}
export async function getDeptTreeExId(params) {
    return request('/api/dept/tree?deptId=' + `${params.id}`)
}

//部门管理操作
export async function getDeptTable() {
    return request('/api/depts')
}
//获取部门角色
export async function getDeptRoles(params) {
    return request('/api/dept/roles?deptId=' + `${params.id}`, {
        method: 'POST',
    });
}
//更新部门角色
export async function updateDeptRoles(params) {
    return request('/api/dept/roles', {
        method: 'PUT',
        data: { ...params }
    });
}
//获取部门角色
export async function getUserByKey(params) {
    return request('/api/user/selectUser?', {
        method: 'POST',
        data: { key: params.key }
    });
}
//添加部门
export async function addDept(params) {
    return request('/api/dept?', {
        method: 'POST',
        data: { ...params }
    });
}

//删除部门
export async function deleteDept(params) {
    return request('/api/dept?id=' + `${params}`, {
        method: 'delete',
    });
}


