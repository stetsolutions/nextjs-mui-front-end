import { customRender } from '../../../utilities/testing/custom-render'
import UsersUpsert from '../UsersUpsert'

test('UsersUpsert :: renders component', () => {
  customRender(<UsersUpsert close={() => {}} fetch={() => {}} row={{}} open />)
})
