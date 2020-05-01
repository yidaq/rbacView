import { queryCurrent } from '@/services/user';

const DeptEdit = {
    namespace: 'deptEdit',
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
export default DeptEdit;
