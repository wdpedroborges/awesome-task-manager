import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  username: string;
  email: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
  },
});

export const { setIsLoggedIn, setUsername, setEmail } = userSlice.actions;

export default userSlice.reducer;