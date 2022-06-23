import { createSlice } from '@reduxjs/toolkit';
import { defaults } from 'lodash';

import { initialState } from './initialState';
import {
  addLiquidity,
  calculateAmountIn,
  calculateAmountOut,
  calculateMaxAmountOut,
  getData,
  removeLiquidity,
  swapIn,
} from './thunks';
import { selectProvider } from './selectors';

const slice = createSlice({
  name: 'Provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        const { payload } = action;

        state.data = defaults(payload, initialState.data);
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      })
      .addCase(swapIn.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(swapIn.fulfilled, (state) => {
        state.status = 'fulfilled';
      })
      .addCase(swapIn.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      })
      .addCase(addLiquidity.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addLiquidity.fulfilled, (state) => {
        state.status = 'fulfilled';
      })
      .addCase(addLiquidity.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      })
      .addCase(calculateAmountIn.pending, (state) => {
        state.isCalculatingAmountIn = true;
      })
      .addCase(calculateAmountIn.fulfilled, (state, action) => {
        const { payload } = action;

        state.isCalculatingAmountIn = false;
        state.calculatedAmountInValue = defaults(
          payload,
          initialState.calculatedAmountInValue
        );
      })
      .addCase(calculateAmountIn.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      })
      .addCase(calculateAmountOut.pending, (state) => {
        state.isCalculatingAmountOut = true;
      })
      .addCase(calculateAmountOut.fulfilled, (state, action) => {
        const { payload } = action;

        state.isCalculatingAmountOut = false;
        state.calculatedAmountOutValue = defaults(
          payload,
          initialState.calculatedAmountOutValue
        );
      })
      .addCase(calculateAmountOut.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      })
      .addCase(calculateMaxAmountOut.pending, (state) => {
        state.isCalculatingMaxAmountOutValue = true;
      })
      .addCase(calculateMaxAmountOut.fulfilled, (state, action) => {
        const { payload } = action;

        state.isCalculatingMaxAmountOutValue = false;
        state.calculatedMaxAmountOutValue = defaults(
          payload,
          initialState.calculatedMaxAmountOutValue
        );
      })
      .addCase(calculateMaxAmountOut.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      })
      .addCase(removeLiquidity.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(removeLiquidity.fulfilled, (state) => {
        state.status = 'fulfilled';
      })
      .addCase(removeLiquidity.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? '';
      });
  },
});

const { reducer } = slice;

export {
  reducer,
  selectProvider,
  getData,
  swapIn,
  addLiquidity,
  calculateAmountIn,
  calculateAmountOut,
  calculateMaxAmountOut,
  removeLiquidity,
};
