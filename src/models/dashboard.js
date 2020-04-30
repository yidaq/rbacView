import { getLoginUser, queryCurrent } from '@/services/user';
import { getDeptTable } from '@/services/dept';

const DashboardModel = {
    namespace: 'dashboard',
    state: {
        currentUser: undefined,
        loginUsers: [],
        deptInfo: [],
    },
    effects: {
        *init(_, { put }) {
            yield put({
                type: 'fetchCurrent',
            });
            yield put({
                type: 'fetchLoginUsers',
            });
            yield put({
                type: 'fetchDeptInfo',
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

        *fetchLoginUsers(_, { call, put }) {
            const response = yield call(getLoginUser);
            yield put({
                type: 'save',
                payload: {
                    loginUsers: Array.isArray(response.data) ? response.data : [],
                },
            });
        },

        *fetchDeptInfo(_, { call, put }) {
            const response = yield call(getDeptTable);
            yield put({
                type: 'save',
                payload: {
                    deptInfo: Array.isArray(response.data) ? response.data : [],
                },
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
                loginUsers: [],
                deptInfo: [],
            };
        },
    },
};
export default DashboardModel;
