import { getChart, getCount } from '@/services/log';

const LogModel = {
    namespace: 'log',
    state: {
        chart: {},
        rankingListData: {}
    },

    effects: {
        *getLogChart(_, { call, put }) {
            const response = yield call(getChart);
            yield put({
                type: 'saveChart',
                payload: response,
            });
        },
        *getRankingListData(_, { call, put }) {
            const response = yield call(getCount);
            yield put({
                type: 'saveRankingListData',
                payload: response,
            });
        },


    },

    reducers: {
        saveChart(state, action) {
            return { ...state, chart: action.payload.data || {} };
        },
        saveRankingListData(state, action) {
            return { ...state, rankingListData: action.payload.data || {} };
        },

    },
};
export default LogModel;
