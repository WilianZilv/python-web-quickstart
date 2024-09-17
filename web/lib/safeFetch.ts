import { useTodoStore } from "@/core/store";
import { devSleep } from "./utils";




interface Dictionary<T> {
    [Key: string]: T;
  }
  
  const abortControllers = {} as Dictionary<AbortController>;
  
  export const safeFetch = async (
    endpoint: string,
    method: string = "GET",
    payload: any = undefined
  ) => {
    const key = endpoint + method;
    if (abortControllers[key]) {
      abortControllers[key].abort();
    }
    abortControllers[key] = new AbortController();
  
    const store = useTodoStore.getState();
  
    store.setPending();
  
    try {
      const res = await fetch(endpoint, {
        signal: abortControllers[key].signal,
        method,
        headers:
          payload !== undefined
            ? {
                "Content-Type": "application/json",
              }
            : undefined,
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
      });
      await devSleep(500);
  
      if (!res.ok) {
        return {
          data: undefined,
          error: await res.json(),
        };
      }
      try {
        return {
          data: await res.json(),
          error: undefined,
        };
      } catch (error) {
        return {
          data: res.ok,
          error: undefined,
        };
      }
    } catch (error) {
      return {
        data: undefined,
        error,
      };
    } finally {
      store.setEnded();
    }
  };