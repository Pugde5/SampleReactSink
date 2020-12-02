import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { IsInRole } from './IsInRole';
import { render } from '../test/testUtils';
import { Roles } from './Roles';
import '@testing-library/jest-dom';

const INITIAL_STATE = {
  user: {
    given_name: 'John',
    username: 'john',
    name: 'John Mocks',
    roles: [Roles.SUBMISSION_DRAFTER],
  },
};

describe('IsInRole', () => {
  test('loads child content when the proper role is in the global state', () => {
    render(
      <IsInRole roles={[Roles.SUBMISSION_DRAFTER]}>
        <div data-testid="test" />
      </IsInRole>,
      { state: INITIAL_STATE },
    );

    waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });
  });

  test('does not load child content when the proper role is not in the global state', () => {
    render(
      <IsInRole roles={[Roles.SUBMISSION_SENDER]}>
        <div data-testid="test" />
      </IsInRole>,
      { state: INITIAL_STATE },
    );

    expect(screen.queryByTestId('test')).toBeNull();
  });
});
