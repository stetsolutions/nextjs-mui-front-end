import { render } from '@testing-library/react'
import { boolean } from 'yup'

import { LayoutContext, LayoutProvider } from '../Layout'

test('LayoutContext :: [LayoutContext] renders component', () => {
  const value = {
    isDisplayed: (pathname: string) => {
      return true
    }
  }

  render(<LayoutContext.Provider value={value}></LayoutContext.Provider>)
})

test('LayoutContext :: [LayoutProvider] renders component with attribute', () => {
  render(<LayoutProvider exclude={['/verify']}></LayoutProvider>)
})
