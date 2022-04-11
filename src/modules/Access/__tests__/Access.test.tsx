import {
  customRender,
  fireEvent,
  screen,
  waitFor
} from '../../../utilities/testing/custom-render'
import Access from '../Access'
import Header from '../../../layout/Header'

test('Access :: renders component', () => {
  customRender(<Access close={() => {}} isOpen={false} />)
})

test('Access :: renders component (dialog)', () => {
  customRender(<Access close={() => {}} isOpen={false} variant='dialog' />)
})

test('Access :: changes tabs', () => {
  customRender(<Access close={() => {}} isOpen={false} />)

  fireEvent.click(screen.getByRole('tab', { name: /register/i }))
})

test('Access :: opens/closes component (dialog)', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  fireEvent.click(screen.getByRole('menuitem', { name: /sign in/i }))

  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()

  await waitFor(() => {
    const presentation = screen.getAllByRole(/presentation/i)
    if (presentation[0].firstElementChild) {
      fireEvent.click(presentation[0].firstElementChild)
    }
  })

  await waitFor(() => {
    expect(
      screen.queryByRole('menuitem', { name: /sign in/i })
    ).not.toBeInTheDocument()
  })
})
