import {createSlice} from '@reduxjs/toolkit';

const registerSlice = createSlice({
    name:"register",
    initialState:{
        currentUser:null,
        isFetching:false,
        error:false,
        loadings:false
    },
    reducers:{
        registerStart:(state)=>{
            state.isFetching=true;
            state.loadings=true;
            state.error=false
        },
        registerSuccess:(state,action)=>{
            state.isFetching=false
            state.currentUser=action.payload.data
            state.error=false;
            state.loadings=action.payload.load
        },
        registerFailure:(state,action)=>{
            state.isFetching=false;
            state.error=action.payload
            state.loadings=false
        }
    }
})

export const {registerStart,registerFailure,registerSuccess} = registerSlice.actions;
export default registerSlice.reducer;