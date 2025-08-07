
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClientV2 } from "../api";
// ...removed unused import...
import { Advertisment } from "../../models/Advertisment";
import { useState } from "react";
import { useLockedState } from "../../hook/useLockedState";

export const useAds = () => {

  // ...removed dashType logic...
  const [searchTerm, setSearchTerm] = useState("");
  
  
  const queryClient = useQueryClient();

  // ...removed axiosClientV2.defaults.params assignment...

  // server functions
  const getAds = async () => {
    const res = await axiosClientV2.get<{ data: Advertisment[] }>('/ads');
    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error('Failed to fetch ads');
    }
  };

  const getAdById = async ({id}: {id: number}) => {
    const res = await axiosClientV2.get<{ data: Advertisment }>(`/ads/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error('Failed to fetch ad');
    }
  }

  const addAd = async ({ ad }: {ad: FormData}) => {
    const res = await axiosClientV2.post<{ data: Advertisment }>('/ads', ad);
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error('Failed to add ad');
    }
  }

  const deleteAd = async ({ id }: {id: number}) => {
    const res = await axiosClientV2.delete(`/ads/${id}`);
    if (res.status === 200) {
      return id;
    } else {
      throw new Error('Failed to delete ad');
    }
  }


  // state management


  const {data: ads} = useQuery({
    queryKey: ['ads'],
    queryFn: getAds,
    staleTime: 1000 * 60 * 1, 
  });

  const {mutate: getAdMutation} = useMutation({
  mutationKey: ['getAd'],
    mutationFn: getAdById,
  })

  const {mutate: addAdMutation} = useMutation({
    mutationKey: ['addAd'],
    mutationFn: addAd,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ads'] }),
  });

  const {mutate: deleteAdMutation} = useMutation({
    mutationKey: ['deleteAd'],
    mutationFn: deleteAd,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ads'] }),
  });


  const searchedAds = useLockedState(ads, (ads, setter) => {
    setter(ads?.filter((ad) => ad.title.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);

  return {
    ads: searchedAds,

    addAdMutation,
    deleteAdMutation,
    getAdMutation,

    search: {
      searchTerm,
      setSearchTerm,
    },
  };


};
