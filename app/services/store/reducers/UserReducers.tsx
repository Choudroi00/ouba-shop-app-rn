import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import {User} from '../../../models/User';
import {getUser, login, register} from '../../repository/userRepository';
import {UserState} from '../slices/UserSlice';

export const reducers = {
  updateUser: (state: UserState, action: PayloadAction<User>) => {
    state = action.payload;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<UserState>) => {
  builder
    .addCase(userRegister.pending, (state, action) => {
      state.authStatus = 'false';
    })
    .addCase(userRegister.fulfilled, (state, action) => {
      state.authStatus = 'true';
      state = action.payload ?? state;
    })
    .addCase(userRegister.rejected, (state, action) => {
      state.authStatus = 'error';
    })
    .addCase(userLogin.pending, (state, action) => {
      state.authStatus = 'false';
    })
    .addCase(userLogin.fulfilled, (state, action) => {
      state.authStatus = 'true';
      state = action.payload ?? state;
    })
    .addCase(userLogin.rejected, (state, action) => {
      state.authStatus = 'error';
    });
};

const userRegister = createAsyncThunk(
  'user/register',
  async (payload: User, {rejectWithValue}) => {
    let user = await getUser(payload.email ?? '');

    if (user) rejectWithValue('user already exists');

    user = await register(payload);

    if (user) return user;

    rejectWithValue('failed to register user');
  },
);

const userLogin = createAsyncThunk(
  'user/login',
  async (payload: User, {rejectWithValue}) => {
    let user = await getUser(payload.email ?? '');

    if (!user) rejectWithValue('invalid email');

    if (await login(payload)) return user as User;

    rejectWithValue('failed to login user');
  },
);
