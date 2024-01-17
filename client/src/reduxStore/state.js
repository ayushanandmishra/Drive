import { createSlice } from '@reduxjs/toolkit'

const initialState={
    user:null,
    token:null, 
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setLogin: (state,action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
      
        state.user=action.payload.user;
        state.token=action.payload.token;
      },
      setLogout: (state) => {
        state.user=null;
        state.token=null;
      },
    },
  })

  export const {setLogin,setLogout}=authSlice.actions;
  export default authSlice.reducer;