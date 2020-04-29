import { getDeptTree, getDeptTable } from '@/services/dept';

const DeptModel = {
    namespace: 'dept',
    state: {
        deptTree: {},
        deptTable: []
    },

    effects: {
        *getDeptTree(_, { call, put }) {
            const response = yield call(getDeptTree);
            yield put({
                type: 'saveDeptTree',
                payload: response,
            });
        },
        *getDeptTable(_, { call, put }) {
            const response = yield call(getDeptTable);
            yield put({
                type: 'saveDeptTable',
                payload: response,
            });
        },

    },

    reducers: {
        saveDeptTree(state, action) {
            return { ...state, deptTree: action.payload.data || {} };
        },
        saveDeptTable(state, action) {
            return { ...state, deptTable: action.payload.data || {} };
        },
    },
};
export default DeptModel;
