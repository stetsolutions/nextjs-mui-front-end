import { screen } from '@testing-library/react'

import { customRender } from '../../utilities/testing/custom-render'
import Footer from '../Footer'

test('Footer :: renders component', () => {
  customRender(<Footer />)
})

test('Footer :: renders but does not display', () => {
  customRender(<Footer />, { route: '/verify' })

  expect(
    screen.getByText(/Copyright 2021, STET Solutions Inc. All Rights Reserved/i)
  ).not.toBeVisible()
})

test('Footer :: displays copyright', () => {
  customRender(<Footer />)

  expect(
    screen.getByText(/Copyright 2021, STET Solutions Inc. All Rights Reserved/i)
  ).toBeInTheDocument()
})
