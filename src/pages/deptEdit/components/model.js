import { getDeptOwnPermission } from '../service'

const DeptOwnPermission = {
    namespace: 'deptPermission',
    state: {
        allPermissions: [],
        ownPermissions: [],
    },
    effects: {
        *getDeptOwnPermissions({ payload }, { call, put }) {
            const response = yield call(getDeptOwnPermission, payload);
            yield put({
                type: 'saveDeptOwn',
                payload: response,
            })
        },
        *changeDeptOwnPermissions({ payload }, { put }) {
            yield put({
                type: 'changeDeptOwn',
                payload: {
                    allPermissions: payload.allPermissions,
                    ownPermissions: payload.ownPermissions,
                }
            })
        },

        *deleteDeptOwnPermissions({ payload }, { put }) {
            const move = payload.moveKeys
            yield put({
                type: 'deleteDeptOwn',
                payload: {
                    moveKeys: move,
                }
            })
        },
    },
    reducers: {
        saveDeptOwn(state, action) {
            return { ...state, allPermissions: action.payload.data.allPermissions || [], ownPermissions: action.payload.data.ownPermissions || [] }
        },
        changeDeptOwn(state, action) {
            return { ...state, allPermissions: action.payload.allPermissions || [], ownPermissions: action.payload.ownPermissions || [] }
        },
        deleteDeptOwn(state, action) {
            state.ownPermissions.splice(state.ownPermissions.indexOf(action.payload.moveKeys), 1)
            return { ...state, ownPermissions: state.ownPermissions || [] }
        },
    }
}
export default DeptOwnPermission;