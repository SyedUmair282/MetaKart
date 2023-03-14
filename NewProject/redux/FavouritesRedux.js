import {createSlice} from "@reduxjs/toolkit"

const favouriteSlice = createSlice({
    name:"favourite",
    initialState:{
        favourites:[],
        totalQuantity:0,
        isFetching:false,
        error:false
    },
    reducers:{
        addFavourite:(state,action)=>{

           
            //    const tempFav = {...action.payload,favQuantity:1};
              // state.totalQuantity+=1;
            //    console.log(state.favourites.includes(action.payload.product_id))
            //    state.favourites.push(action.payload);
            //    alert('added to fav');
            // state.isFetching=false;
            state.favourites=action.payload
            // alert("data added to fav")
           
        }, getFavourite:(state,action)=>{

           
            //    const tempFav = {...action.payload,favQuantity:1};
              // state.totalQuantity+=1;
            //    console.log(state.favourites.includes(action.payload.product_id))
            //    state.favourites.push(action.payload);
            //    alert('added to fav');
            // state.isFetching=false;
            state.favourites=action.payload
            // alert("data added to fav")
           
        },
        removeFavourite:(state,action)=>{
           // state.totalQuantity-=1
            // console.log(action.payload.product_id)
            // const modifiedFavourites = state.favourites.filter(item => item.product_id !== action.payload.product_id)
            // state.favourites = modifiedFavourites;
            // alert('remove from Fav');
            state.favourites=action.payload
            // alert("data remove to fav")
        },
        addFavFailure:(state)=>{
            state.isFetching=false;
            state.error=true;
        }

       
    },
})

export const {addFavourite, removeFavourite,getFavourite } =favouriteSlice.actions;
export default favouriteSlice.reducer;