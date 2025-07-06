import { createSlice } from "@reduxjs/toolkit";
import { Advertisment } from "../../../models/ads";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../utils/helpers";
import { AppDispatch } from "../store";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api";


const initialState : Advertisment[] = [];

const AdsSlice = createSlice({
    name: "ads",
    initialState,
    reducers: {
        setAds: (state, action) => {
            return action.payload;
        },
        addAd: (state, action) => {
            state.push(action.payload);
        },
        removeAd: (state, action) => {
            return state.filter(ad => ad.id !== action.payload);
        },
    },
})

export const { setAds, addAd, removeAd } = AdsSlice.actions;

export const AdsReducer = AdsSlice.reducer;


// ------------------- hook part -----------------

const useAds = () => {
    const ads = useTypedSelector(state => state.ads);
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAdsList = async () => {
        const response = await axiosClient.get<Advertisment[]>("/advertisments");
        return response.data;
    };

    const refreshAds = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdsList();
            dispatch(setAds(data));
        } catch (err) {
            console.error("Failed to fetch ads:", err);
            setError("Failed to fetch ads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAds();
    }, []);

    return {
        ads,
        loading,
        error,
        refreshAds,
    };
};

export { useAds };







