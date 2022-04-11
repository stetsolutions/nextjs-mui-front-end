import { screen } from '@testing-library/react'

import { customRender } from '../../utilities/testing/custom-render'
import Layout from '../Layout'

test('Layout :: renders component', () => {
  customRender(<Layout />)
})

test('Layout :: renders component without toolbar', () => {
  customRender(<Layout />, { route: '/access' })
})
