import { getLoginUser, queryCurrent } from '@/services/user';

const DashboardModel = {
    namespace: 'dashboard',
    state: {
        currentUser: undefined,
        loginUsers: [],
    },
    effects: {
        *init(_, { put }) {
            yield put({
                type: 'fetchCurrent',
            });
            yield put({
                type: 'fetchLoginUsers',
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

    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },

        clear() {
            return {
                currentUser: undefined,
                loginUsers: [],
            };
        },
    },
};
export default DashboardModel;
