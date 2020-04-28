import { getDeptTree } from '@/services/dept';

const DeptModel = {
    namespace: 'dept',
    state: {
        deptTree: {},
    },

    effects: {
        *getDeptTree(_, { call, put }) {
            const response = yield call(getDeptTree);
            yield put({
                type: 'saveDeptTree',
                payload: response,
            });
        },

    },

    reducers: {
        saveDeptTree(state, action) {
            return { ...state, deptTree: action.payload.data || {} };
        },
    },
};
export default DeptModel;
