import {createSlice} from "@reduxjs/toolkit";
import {fetchGame} from "./actionCreator";

const initialState ={
    game:undefined,
    isLoading:false,
    error:''
}

const gameSlice = createSlice({
    name:'game',
    initialState,
    reducers:{
        deleteGame(state){
            state.game = initialState.game
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(
            fetchGame.fulfilled,
            (state, action)=>{
                state.game = action.payload
                state.isLoading = false
                state.error = ''
            }
        )
            .addCase(
                fetchGame.pending,
                (state)=>{
                    state.isLoading = true
                }
            )
            .addCase(
                fetchGame.rejected,
                (state,action)=>{
                    state.isLoading = false
                    state.error = action.payload
                }
            )
    }
})

export default gameSlice.reducer