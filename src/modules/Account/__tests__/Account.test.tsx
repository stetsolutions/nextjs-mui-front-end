import {
  customRender,
  fireEvent,
  screen
} from '../../../utilities/testing/custom-render'
import Account from '../Account'

test('Account :: renders component', () => {
  customRender(<Account />)
})

test('Accounts :: changes tabs', () => {
  customRender(<Account />)

  fireEvent.click(screen.getByRole('tab', { name: /password/i }))
})
