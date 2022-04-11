import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  VictoryArea,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryPie,
  VictoryPolarAxis,
  VictoryPortal,
  VictoryScatter,
  VictoryStack,
  VictoryTheme
} from 'victory'

import { useUserContext } from '../../contexts/User'

const colors = ['#428517', '#77D200', '#D6D305', '#EC8E19', '#C92B05']

function Dashboard () {
  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3, p: 1 }}>
        <CardHeader
          title='Dashboard'
          titleTypographyProps={{
            component: 'h3',
            variant: 'h5'
          }}
        />
        <CardContent>
          <Typography variant='body1'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Card sx={{ p: 1 }}>
            <CardHeader
              title='Lorem Ipsum'
              titleTypographyProps={{
                component: 'h6',
                variant: 'h6'
              }}
            />
            <CardContent>
              <VictoryChart theme={VictoryTheme.material}>
                <VictoryGroup offset={20} colorScale={'qualitative'}>
                  <VictoryBar
                    data={[
                      { x: 1, y: 1 },
                      { x: 2, y: 2 },
                      { x: 3, y: 5 }
                    ]}
                  />
                  <VictoryBar
                    data={[
                      { x: 1, y: 2 },
                      { x: 2, y: 1 },
                      { x: 3, y: 7 }
                    ]}
                  />
                  <VictoryBar
                    data={[
                      { x: 1, y: 3 },
                      { x: 2, y: 4 },
                      { x: 3, y: 9 }
                    ]}
                  />
                </VictoryGroup>
              </VictoryChart>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Card sx={{ p: 1 }}>
            <CardHeader
              title='Dolor Sit'
              titleTypographyProps={{
                component: 'h6',
                variant: 'h6'
              }}
            />
            <CardContent>
              <VictoryPie theme={VictoryTheme.material} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Card sx={{ p: 1 }}>
            <CardHeader
              title='Amet Consectetur'
              titleTypographyProps={{
                component: 'h6',
                variant: 'h6'
              }}
            />
            {/* <CardContent>
              <VictoryChart
                polar
                theme={VictoryTheme.material}
                domain={{ y: [0, 10] }}
              >
                <VictoryPolarAxis
                  dependentAxis
                  style={{ axis: { stroke: 'none' } }}
                  tickFormat={() => ''}
                />
                <VictoryPolarAxis
                  tickValues={[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]}
                  tickFormat={['2π', 'π/2', 'π', '3π/2']}
                  labelPlacement='vertical'
                />
                {[5, 4, 3, 2, 1].map((val, i) => {
                  return (
                    <VictoryLine
                      key={i}
                      samples={100}
                      style={{ data: { stroke: colors[i] } }}
                      y={d => val * (1 - Math.cos(d.x))}
                    />
                  )
                })}
              </VictoryChart>
            </CardContent> */}
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Card sx={{ p: 1 }}>
            <CardHeader
              title='Adipiscing Elit'
              titleTypographyProps={{
                component: 'h6',
                variant: 'h6'
              }}
            />
            {/* <CardContent>
              <VictoryChart scale={{ x: 'time' }} width={400} height={400}>
                <VictoryStack colorScale='qualitative'>
                  <VictoryGroup
                    data={[
                      { x: new Date(1986, 1, 1), y: 2 },
                      { x: new Date(1996, 1, 1), y: 3 },
                      { x: new Date(2006, 1, 1), y: 5 },
                      { x: new Date(2016, 1, 1), y: 4 }
                    ]}
                  >
                    <VictoryArea />
                    <VictoryPortal>
                      <VictoryScatter style={{ data: { fill: 'black' } }} />
                    </VictoryPortal>
                  </VictoryGroup>
                  <VictoryGroup
                    data={[
                      { x: new Date(1986, 1, 1), y: 4 },
                      { x: new Date(1996, 1, 1), y: 3 },
                      { x: new Date(2006, 1, 1), y: 2 },
                      { x: new Date(2016, 1, 1), y: 5 }
                    ]}
                  >
                    <VictoryArea />
                    <VictoryPortal>
                      <VictoryScatter style={{ data: { fill: 'black' } }} />
                    </VictoryPortal>
                  </VictoryGroup>
                  <VictoryGroup
                    data={[
                      { x: new Date(1986, 1, 1), y: 3 },
                      { x: new Date(1996, 1, 1), y: 1 },
                      { x: new Date(2006, 1, 1), y: 4 },
                      { x: new Date(2016, 1, 1), y: 2 }
                    ]}
                  >
                    <VictoryArea />
                    <VictoryPortal>
                      <VictoryScatter style={{ data: { fill: 'black' } }} />
                    </VictoryPortal>
                  </VictoryGroup>
                </VictoryStack>
              </VictoryChart>
            </CardContent> */}
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
