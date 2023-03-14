import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "test",
    initialState: {
        products: [],
        quantity: 0,
        total: 0,
    },
    reducers: {
        addProductTest: (state, action) => {
            // console.log("🚀 ~ ", state, action)
            state.quantity += 1;
            state.products.push(action.payload);
            state.total += action.payload.price * action.payload.quantity;
            
        },
        resetCartTest: (state, action) => {
            state.quantity = 0;
            state.products = []
            state.total = 0
        },
        deleteProductTest: (state, action) => {
            state.products.filter((x) => {
                if (x.product_id === action.payload) {
                    state.total -= x.price * x.quantity
                }
            })
            state.quantity -= 1
            const modifiedCart = state.products.filter(item => item.product_id !== action.payload)
            state.products = modifiedCart
        },
        modifyCartTest:(state,action)=>{ 
            state.products.filter((x)=>{
                if(x.product_id===action.payload.product_id){
                    state.total -= x.price * x.quantity
                    state.total += x.price * action.payload.quantity
                }
            })
            
            state.products.forEach((element,index)=>{
                if(element.product_id===action.payload.product_id){
                    state.products[index].quantity = action.payload.quantity
                }
            })

        },


    },
})

export const { addProductTest, deleteProductTest, resetCartTest, modifyCartTest } = cartSlice.actions;
export default cartSlice.reducer;
