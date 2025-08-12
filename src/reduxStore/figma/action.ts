import { createAsyncThunk } from "@reduxjs/toolkit";
import { serverApi } from "../../resources/server-api";
import { ACTION_TYPE } from "../types";
import { FigmaFileAction } from "../../domain";

export const postDetectFigmaFileKey = createAsyncThunk(
  ACTION_TYPE.POST_DETECT_FIGMA_FILE_KEY,
  async (payload: { url: string , action?: FigmaFileAction}, thunkAPI) => {
    return await serverApi.detectFigmaFileKey(payload);
  }
);

export const getDetectFigmaFileKey = createAsyncThunk(
  ACTION_TYPE.GET_DETECT_FIGMA_FILE_KEY,
  async ({ figmaFileKey, version }: { figmaFileKey: string; version: number }, thunkAPI) => {
    return await serverApi.getFigmaFileByKeyAndVersion(figmaFileKey, version);
  }
);
