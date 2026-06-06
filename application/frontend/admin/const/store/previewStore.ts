import type { FormRecord } from "@/const/type/config/EntityConfigType";

export type PreviewState = {
  regulationPreview: {
    id: string;
    form: FormRecord;
  } | null;
};

export type StoreState = {
  preview: PreviewState;
};

export const initialStoreState: StoreState = {
  preview: {
    regulationPreview: null,
  },
};

declare module "little-state-machine" {
  interface GlobalState extends StoreState {}
}

export function updateStore(
  state: StoreState,
  payload: Partial<StoreState>
): StoreState {
  return {
    ...state,
    ...payload,
    preview: {
      ...state.preview,
      ...payload.preview,
    },
  };
}
