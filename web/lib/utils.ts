import { useTodoStore } from "@/core/store";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { publish, subscribe, unsubscribe } from "pubsub-js";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const devSleep = async (ms: number) => {
  if (process.env.NODE_ENV === "development") {
    await sleep(ms);
  }
};

export function dispatch(action: string, ...args: any){
  publish(action, args)
}


export function registerAction(action: string) {
  return function <T extends (...args: any[]) => any>(func: T): T {
    const wrapped = async (...args: any[]) => {
      const store = useTodoStore.getState();
      const subject = `${action}:result`;
      try {
        const result = await func(...args);
        publish(subject, { data: result });
        return result;
      } catch (error) {
        publish(subject, { error });
        publish("error", { error });
      } finally {
        store.setEnded();
      }
    };

    console.log("subscribing to", action);

    subscribe(action, (msg: string, args: any) => wrapped(...args));


    return wrapped as T;
  };
}

interface ActionResult {
  data: any;
  error: any;
}


const resultListeners = {} as any

export function onActionResult(action: string, handler: ({ data, error }: ActionResult) => Promise<void> | void, globalError: boolean = false) {
  
  let subject = `${action}:result`;
  
  if (globalError) {
    subject = action;
  }

  if (resultListeners[subject]) {
    unsubscribe(resultListeners[subject])
  }
  
  const listener = subscribe(subject, async (msg: string, { data, error }: ActionResult) => handler({ data, error }));

  resultListeners[subject] = listener;
}


export function durationToString(created_at?: Date, ended_at?: Date) {

  let durationLabel = undefined;

  if (created_at && ended_at) {
    const duration = ended_at.getTime() - created_at.getTime();

    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      durationLabel = `${hours}h${minutes % 60 < 10 ? "0" : ""}${
        minutes % 60
      }m`;
    } else if (minutes > 0) {
      durationLabel = `${minutes}m${seconds % 60 < 10 ? "0" : ""}${
        seconds % 60
      }s`;
    } else {
      durationLabel = `${seconds}s`;
    }
  }

  return durationLabel;
}