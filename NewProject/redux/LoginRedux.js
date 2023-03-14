import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name:"user",
    initialState:{
        currentUser:null,
        isFetching:false,
        error:false,
        loadings:false
    },
    reducers:{
        loginStart:(state)=>{ 
            state.isFetching=true;
            state.loadings=true;
            state.error=false
        },
        loginSuccess:(state,action)=>{ 
            state.isFetching=false
            state.currentUser=action.payload.data
            state.error=false;
            state.loadings=action.payload.load
        },
        loginFailure:(state,action)=>{ 
            state.isFetching=false;
            state.error=action.payload
            state.loadings=false
        },
        Logout:(state)=>{ 
            state.isFetching=false;
           state.currentUser=null;
           state.error=false;
           state.loadings=false
        },
    },
})

export const {loginStart,loginSuccess,loginFailure,Logout} = userSlice.actions
export default userSlice.reducer;