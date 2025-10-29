// import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
// import axios from "axios";

// axios.defaults.baseURL = "http://localhost:4000";

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({  password,email }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("/api/auth/login", {password,email });
//        localStorage.setItem("token", response.data.token);
     
//       return response.data; // { token }
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );


// export const registerUser=createAsyncThunk(
//     "auth/register",
//     async({username,email,password},{rejectWithValue})=>{
//         try{
//             const response=await axios.post("/api/auth/register",{username,email,password})
//             return response.data;
//         }catch(err){
//             return rejectWithValue(err.response.data)
//         }
// })


// const authSlice=createSlice({
//     name:"auth",
//     initialState:{
//         token: localStorage.getItem("token") || null,
       
//         status: "idle",
//         error:null,
//         message:null,
//         loggedIn:!!localStorage.getItem("token"),
//     },  
//     reducers:{
//         logout:(state)=>{
//             state.token=null;
//             localStorage.removeItem("token")
//         }
//     },
//     extraReducers:(builder)=>{
//         builder
//         .addCase(loginUser.pending,(state)=>{
//             state.status="loading";
//             state.error=null;
//             state.message="Authenticating..."
//         })
//         .addCase(loginUser.fulfilled,(state,action)=>{
//             state.status="succeeded";
//             state.loggedIn=true;
//             state.token=action.payload.token;
//             state.message=null;
//             localStorage.setItem("token",action.payload.token)
//         })
//         .addCase(loginUser.rejected,(state,action)=>{
//             state.status="failed";
//             state.loggedIn=false;
//              state.message=null;
//              state.token=null;
//             state.error=action.payload?.message||"Login failed"
//         })  
//         .addCase(registerUser.pending,(state)=>{
//             state.status="loading";
//             state.error=null;
//             state.message="Registering..."
//         })
//         .addCase(registerUser.fulfilled,(state,action)=>{
//             state.status="succeeded";
//             state.loggedIn=false;
//             state.token=action.payload.token;
//             localStorage.setItem("token",action.payload.token)
//         })
//         .addCase(registerUser.rejected,(state,action)=>{
//                 state.status="failed";
//                     state.loggedIn=false;
//                     state.error=action.payload?.message||"Registration failed"
//             })
//     }
// })

// export const {logout}=authSlice.actions;
// export default authSlice.reducer;

          import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://personal-assistant-kytu.onrender.com/";
// https://personal-assistant-kytu.onrender.com/

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      return response.data; // { token,userId,message }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ---------------- REGISTER ----------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/register", { username, email, password });
      return response.data; // { message }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// ---------------- Get Profile ----------------
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/auth/profile/${userId}`);
      return response.data; // { user profile data }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    status: "idle",
    userId: localStorage.getItem("userId") || null,
    error: null,
    message: null,
    loggedIn: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.loggedIn = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => { state.error = null; },
    clearMessage: (state) => { state.message = null; },
  },
  extraReducers: (builder) => {
    builder
      // -------- LOGIN --------
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = "Authenticating...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.loggedIn = true;
        state.message = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
        state.loggedIn = false;
      })

      // -------- REGISTER --------
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = "Registering...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = "Registration successful! Please log in.";

        state.loggedIn = false;
        state.token = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Registration failed";
      })
      // -------- GET PROFILE --------
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = "Fetching profile...";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.message = null;
        // You can store profile data in state if needed
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch profile";
      });
  },
});

export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
  

