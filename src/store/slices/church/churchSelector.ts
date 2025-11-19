import type { RootState } from '@/store';

// Selectores
export const selectCurrentChurch = (state: RootState) => state.church.currentChurch;
export const selectChurchId = (state: RootState) => state.church.currentChurch?.id;
export const selectChurchSlug = (state: RootState) => state.church.currentChurch?.slug;
export const selectChurchLoading = (state: RootState) => state.church.isLoading;
export const selectChurchError = (state: RootState) => state.church.error;
export const selectHasChurch = (state: RootState) => !!state.church.currentChurch;