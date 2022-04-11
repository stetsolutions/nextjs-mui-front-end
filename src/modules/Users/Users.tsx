import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PasswordIcon from '@mui/icons-material/Password'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import {
  DataGrid,
  GridActionsCellItem,
  GridRowParams,
  GridRowsProp,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'

import { isAuthorized, useUserContext } from '../../contexts/User'
import { reset } from '../../services/api/auth'
import { read, remove } from '../../services/api/users'
import CustomError from '../../types/CustomError'
import UsersUpsert from './UsersUpsert'

interface RowData {
  created?: string
  email?: string
  first_name?: string
  id?: number
  last_name?: string
  role?: string
  username?: string
  verified?: boolean
}

function Users () {
  const active = useRef(true)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false)
  const [rowData, setRowData] = useState<RowData>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [authorized, setAuthorized] = useState(false)
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowCount, setRowCount] = useState<number>()
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'id', sort: 'asc' }
  ])
  const [upsertOpen, setUpsertOpen] = useState<boolean>(false)
  const { user } = useUserContext()

  const handleAddClick = () => {
    setRowData({})
    setUpsertOpen(true)
  }

  const handleConfirmationClick = async () => {
    try {
      await remove(rowData.id!)
      await handleFetch()
      setConfirmationOpen(false)

      enqueueSnackbar(`User deleted`, {
        autoHideDuration: 3000,
        variant: 'success'
      })
    } catch (error) {
      enqueueSnackbar(`${(error as CustomError).message}`, {
        autoHideDuration: 3000,
        variant: 'error'
      })
    }
  }

  const handleDeleteClick = async (params: any) => {
    if (params.row.id === user.id) {
      enqueueSnackbar('Not allowed: User prohibited from deleting self', {
        autoHideDuration: 3000,
        variant: 'error'
      })

      return
    }

    setRowData(params.row)
    setConfirmationOpen(true)
  }

  const handleEditClick = (params: any) => {
    setRowData(params.row)
    setUpsertOpen(true)
  }

  const handleFetch = useCallback(async () => {
    setLoading(true)

    try {
      const result = await read(pageSize, page, JSON.stringify(sortModel))

      if (!active.current) {
        return
      }

      setRows(result.rows)
      setRowCount(Number(result.count))
    } catch (error) {
      enqueueSnackbar(`${(error as CustomError).message}`, {
        autoHideDuration: 3000,
        variant: 'error'
      })
    }

    setLoading(false)
  }, [active, enqueueSnackbar, page, pageSize, sortModel])

  const handleResetClick = (params: any) => {
    reset(params.row)

    enqueueSnackbar(`Request sent`, {
      autoHideDuration: 3000,
      variant: 'success'
    })
  }

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel)
  }

  useEffect(() => {
    isAuthorized(router.asPath)
      ? setAuthorized(true)
      : router.push('/dashboard')

    active.current = true

    handleFetch()

    return () => {
      active.current = false
    }
  }, [active, handleFetch])

  if (!authorized && process.env.NODE_ENV !== 'test') {
    return null
  }

  const columns = [
    {
      field: 'id',
      flex: 1,
      headerName: 'ID',
      minWidth: 100
    },
    {
      field: 'email',
      flex: 1,
      headerName: 'Email',
      minWidth: 100
    },
    { field: 'first_name', flex: 1, headerName: 'First Name', minWidth: 100 },
    { field: 'last_name', flex: 1, headerName: 'Last Name', minWidth: 100 },
    { field: 'role', flex: 1, headerName: 'Role', minWidth: 100 },
    { field: 'username', flex: 1, headerName: 'Username', minWidth: 100 },
    { field: 'verified', flex: 1, headerName: 'Verified', minWidth: 100 },
    {
      field: 'actions',
      flex: 1,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={() => handleDeleteClick(params)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          onClick={() => handleEditClick(params)}
        />,
        <GridActionsCellItem
          icon={<PasswordIcon />}
          label='Reset Password'
          onClick={() => handleResetClick(params)}
          showInMenu
        />
      ],
      type: 'actions',
      minWidth: 100
    }
  ]

  function toolbar () {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%'
        }}
      >
        <GridToolbarContainer>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </Box>
        </GridToolbarContainer>
      </Box>
    )
  }

  const dataGrid = (
    <DataGrid
      autoHeight
      columns={columns}
      components={{
        Toolbar: toolbar
      }}
      loading={loading}
      onPageChange={newPage => setPage(newPage)}
      onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      onSortModelChange={handleSortModelChange}
      pageSize={pageSize}
      paginationMode='server'
      rows={rows}
      rowsPerPageOptions={[1, 5, 10, 25, 50, 100]}
      rowCount={rowCount}
      sortingMode='server'
      sortModel={sortModel}
      sx={{
        '& .MuiDataGrid-cell': {
          padding: '0 16px'
        }
      }}
      disableVirtualization={process.env.NODE_ENV === 'test'}
    />
  )

  const dialog = (
    <Dialog
      aria-describedby='alert-dialog-description'
      open={confirmationOpen}
      onClose={() => setConfirmationOpen(false)}
    >
      <DialogContent sx={{ minWidth: 240 }}>
        <DialogContentText id='alert-dialog-description'>
          Delete user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmationClick} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box p={3}>
      <Card sx={{ p: 1 }}>
        <CardHeader
          action={
            <Box sx={{ mr: 1 }}>
              <Button
                onClick={handleAddClick}
                startIcon={<AddCircleIcon />}
                variant='outlined'
              >
                Add
              </Button>
            </Box>
          }
          title='Users'
          titleTypographyProps={{
            component: 'h3',
            variant: 'h5'
          }}
        />
        <CardContent>{dataGrid}</CardContent>
      </Card>
      {dialog}
      <UsersUpsert
        close={() => setUpsertOpen(false)}
        row={rowData}
        fetch={handleFetch}
        open={upsertOpen}
      />
    </Box>
  )
}

export default Users
