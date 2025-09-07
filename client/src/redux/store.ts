import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import authReducer from "./reducer/auth.reducer";
import courseReducer from "./reducer/course.reducer";
import lectureReducer from "./reducer/lecture.reducer";
import reviewReducer from "./reducer/review.reducer";

const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: courseReducer,
        lectures: lectureReducer,
        review: reviewReducer,
    },
    middleware: (getDefaultMiddleware) => (getDefaultMiddleware()
        .concat()
    )
})

const persistor = persistStore(store)

export { persistor, store };
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch