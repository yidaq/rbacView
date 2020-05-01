import { queryCurrent } from '@/services/user';
import { getDeptUsers, getDeptPermissions, getDeptInfo, getExtUser } from './service'

const DeptEdit = {
    namespace: 'deptEdit',
    state: {
        currentUser: undefined,
        deptUsers: [],
        deptPermissions: [],
        deptInfo: [],
        extUser: [],
    },
    effects: {
        *init({ payload }, { put }) {
            yield put({
                type: 'fetchCurrent',
            });
            yield put({
                type: 'fetchDeptUser',
                payload: payload
            });
            yield put({
                type: 'fetchDeptPermissions',
                payload: payload
            });
            yield put({
                type: 'fetchDeptInfo',
                payload: payload
            });
        },

        *fetchCurrent(_, { call, put }) {
            const response = yield call(queryCurrent);
            yield put({
                type: 'save',
                payload: {
                    currentUser: response.data,
                },
            });
        },

        *fetchDeptUser({ payload }, { call, put }) {
            const response = yield call(getDeptUsers, payload);
            yield put({
                type: 'save',
                payload: {
                    deptUsers: response.data,
                },
            });
        },

        *fetchDeptPermissions({ payload }, { call, put }) {
            const response = yield call(getDeptPermissions, payload);
            yield put({
                type: 'save',
                payload: {
                    deptPermission: response.data,
                },
            });
        },
        *fetchDeptInfo({ payload }, { call, put }) {
            const response = yield call(getDeptInfo, payload);
            yield put({
                type: 'save',
                payload: {
                    deptInfo: response.data,
                },
            });
        },
        *getExtUser(_, { call, put }) {
            const response = yield call(getExtUser);
            yield put({
                type: 'save',
                payload: {
                    extUser: response.data,
                },
            });
        },
        *clearExtUser(_, { put }) {
            yield put({
                type: 'clearExtUser',
            });
        },


    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },

        clear() {
            return {
                currentUser: undefined,
                deptUsers: [],
                deptPermissions: [],
                deptInfo: [],
                extUser: [],
            };
        },
        clearExtUser() {
            return {
                extUser: [],
            };
        },
    },
};
export default DeptEdit;
