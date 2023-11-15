import {createAsyncThunk} from "@reduxjs/toolkit";
import {GameHttpService} from "../../services/gameHttpService";


const fetchGame = createAsyncThunk('game/fetch', async (_, thunkAPI)=>{
    try {
        const response = await GameHttpService.getGame()
        return response
    } catch (e){
        return thunkAPI.rejectWithValue(e.response.data.message)
    }
})

export {fetchGame}