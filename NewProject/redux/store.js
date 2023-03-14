import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './LoginRedux';
import registerReducer from './RegisterRedux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import addressReducer from './AddressRedux';
import favouriteReducer from './FavouritesRedux';
import cartReducer from './CartRedux';
import Test_Redux from './Test_Redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import FavouritesRedux from './FavouritesRedux';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  // whitelist: ["Student"]
};

const rootReducer = combineReducers({
  user: userReducer,
  register: registerReducer,
  address: addressReducer,
  favourite: favouriteReducer,
  cart: cartReducer,
  test: Test_Redux,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
