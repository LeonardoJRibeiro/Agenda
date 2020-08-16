import { useCallback } from "react";
import useAuth from "./useAuth";
import api from "../utils/api";

export default function useApi() {
  const { token } = useAuth();
  const get = useCallback(async (url: string) => {
    return await api.get(url,
      {
        headers: {
          Authorization: token,
        }
      }
    )
  }, [token]);

  const post = useCallback(async (url: string, data: any) => {
    return await api.post(url,
      data,
      {
        headers: {
          Authorization: token,
        }
      }
    )
  }, [token]);
  return {
    get,
    post
  }
}