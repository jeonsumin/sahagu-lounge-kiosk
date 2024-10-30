import { createHashRouter } from 'react-router-dom';
import Survey from 'views/Survey';
import Result from 'views/Result';
import Photo from 'views/Photo';
import Outro from 'views/Outro';
import Main from 'views/Main';
import Root from 'views/Root';
import React from 'react';

export const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Root.tsx에 Outlet으로 출력
      {
        path: '',
        element: <Main />,
      },
      {
        path: 'survey',
        element: <Survey />,
      },
      {
        path: 'result',
        element: <Result />,
      },
      {
        path: 'photo',
        element: <Photo />,
      },
      {
        path: 'outro',
        element: <Outro />,
      },
    ],
  },
]);
