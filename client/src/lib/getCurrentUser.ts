import axios from "axios";
import type { AppDispatch } from "../redux/store";
import { setUser } from "../redux/reducer/auth.reducer";

const getCurrentUser = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URI}/api/user/getCurrentUser`,
      { withCredentials: true, timeout: 8000 }
    );

    dispatch(setUser(res.data.data));
  } catch (error) {
    console.log("Error in getCurrentUser frontend: ", error);
    dispatch(setUser(null));
  }
};

export default getCurrentUser;
