import { getPermissionMenuTree } from '@/services/permission';

const PermissionModel = {
    namespace: 'permission',
    state: {
        menuTree: [],
    },

    effects: {
        *getMenuTree({ payload }, { call, put }) {
            const response = yield call(getPermissionMenuTree, payload);
            yield put({
                type: 'saveMenuList',
                payload: response,
            });
        },

    },

    reducers: {
        saveMenuList(state, action) {
            return { ...state, menuTree: action.payload.data || {} };
        },
    },
};
export default PermissionModel;
