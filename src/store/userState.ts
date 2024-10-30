import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import results from 'data/result.json';

interface Answer {
  questionId: number | null;
  nextId?: number;
  result?: any;
}

type UserState  = {
  currentQuestionId: number | null;
  answers: Answer[];
  filename: string;
  data: any;
}

const initialState: UserState = {
  currentQuestionId: 1,
  answers: [],
  filename: '',
  data: {},
};

const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    answerQuestion: (state, action: PayloadAction<{ nextId?: number; resultId?: number }>) => {
      const { nextId, resultId } = action.payload;

      if (resultId) {
        const result = results.find((r) => r.id === resultId);

        if (result) {
          state.answers.push({ questionId: state.currentQuestionId, result });
        }

        state.currentQuestionId = null;

        // console.log('결과:', result);
      } else if (nextId) {
        state.answers.push({ questionId: state.currentQuestionId, nextId });
        state.currentQuestionId = nextId;

        // console.log('현재:', { nextId });
      }
    },
    updateImage: (state, action) => {
      state.filename = action.payload;
    },
    resetSurvey: (state) => {
      state.currentQuestionId = 1;
      state.answers = [];
    },
    update: (state, action) => {
      state.data ={...state.data, ...action.payload};
    },
    clear: (state) => {
      state.data = {}
    }
  },
});

export const { answerQuestion, resetSurvey, updateImage, update,clear } = userStateSlice.actions;
export default userStateSlice.reducer;
