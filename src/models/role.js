import { getRoles } from '@/services/role';

const roleModel = {
    namespace: 'role',
    state: {
        roleMsg: {},
    },

    effects: {
        *getRoleMsg({ payload }, { call, put }) {
            const response = yield call(getRoles, payload);
            yield put({
                type: 'saveRoleMsg',
                payload: response,
            });
        },

    },

    reducers: {
        saveRoleMsg(state, action) {
            return { ...state, roleMsg: action.payload.data || {} };
        },
    },
};
export default roleModel;
