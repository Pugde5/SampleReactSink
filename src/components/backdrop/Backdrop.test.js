import React from 'react';
import { render } from '../../shared/test/testUtils';
import Backdrop from './Backdrop';

describe('Backdrop', () => {
  test('Display backdrop', () => {
    const { getByLabelText } = render(<Backdrop />, { state: { blocking: true } });
    expect(getByLabelText('backdrop').style.visibility).toEqual('');
  });

  test('Hide backdrop', () => {
    const { getByLabelText } = render(<Backdrop />, { state: { blocking: false } });
    expect(getByLabelText('backdrop').style.visibility).toEqual('hidden');
  });
});
