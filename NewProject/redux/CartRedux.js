import {createSlice} from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        products:[],
        quantity:0,
        total:0,
    },
    reducers:{
        addProduct:(state,action)=>{
            state.quantity+=1;
            state.products.push(action.payload);
            state.total += action.payload.product.price * action.payload.qty;
        },
        resetCart:(state,action)=>{
            state.quantity=0;
            state.products=[]
            state.total =0
            console.log(state);
        },
        modifyCart:(state,action)=>{ 

            state.products.filter((x)=>{
                if(x.product.product_id===action.payload.product_id){
                    state.total -= x.product.price * x.qty
                    state.total += x.product.price * action.payload.qty
                }
            })
            
            state.products.forEach((element,index)=>{
                if(element.product.product_id===action.payload.product_id){
                    state.products[index].qty = action.payload.qty
                }
            })

        },
        
        deleteProduct:(state,action)=>{
            state.products.filter((x)=>{
                if(x.product.product_id===action.payload){
                    state.total -= x.product.price * x.qty
                }
            })
            state.quantity-=1
            const modifiedCart = state.products.filter(item => item.product.product_id !== action.payload)
            state.products = modifiedCart

            // state.quantity-=1
            // state.products.splice(action.payload.che,1)
            // for (let index = 0; index < state.products.length; index++) {
            //     state.total += state.products[index].product.price * state.products[index].qty;
            // }


        }, 

       
    },
})

export const {addProduct, deleteProduct,resetCart,modifyCart } =cartSlice.actions;
export default cartSlice.reducer;
