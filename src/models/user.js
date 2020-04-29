import { queryCurrent, query as queryUsers, getUserRoles } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    allRole: [],
    ownRoles: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      localStorage.setItem('group', response.data.group)
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *getUserRoles({ payload }, { call, put }) {
      const response = yield call(getUserRoles, payload);
      yield put({
        type: 'saveUserRole',
        payload: response,
      })
    },

    *changeUserRoles({ payload }, { call, put }) {
      yield put({
        type: 'changeUserRole',
        payload: {
          allRole: payload.allRole,
          ownRoles: payload.ownRoles,
        }
      })
    },

    *deleteUserRoles({ payload }, { call, put }) {
      const move = payload.moveKeys
      yield put({
        type: 'deleteUserRole',
        payload: {
          moveKeys: move,
        }
      })
    },


  },

  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload.data || {} };
    },
    saveUserRole(state, action) {
      return { ...state, allRole: action.payload.data.allRole || [], ownRoles: action.payload.data.ownRoles || [] }
    },
    changeUserRole(state, action) {
      return { ...state, allRole: action.payload.allRole || [], ownRoles: action.payload.ownRoles || [] }
    },
    deleteUserRole(state, action) {
      state.ownRoles.splice(state.ownRoles.indexOf(action.payload.moveKeys), 1)
      return { ...state, ownRoles: state.ownRoles || [] }
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
