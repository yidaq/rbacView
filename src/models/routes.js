import { getRouters } from '@/services/routers'

const routeModel = {
    namespace: 'routes',

    state: {
        routeList: [],
    },

    effects: {
        *getRoutes(_, { call, put }) {
            const response = yield call(getRouters);

            yield put({
                type: 'saveRouteList',
                payload: response,
            });
        },
    },

    reducers: {
        saveRouteList(state, action) {
            return { ...state, routeList: action.payload.data || {} };
        },
    },

};
export default routeModel;
