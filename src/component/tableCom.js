import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  MenuItem,
  Select,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { formatDate, handleChange, handleDateChange } from "../util/util"
import {
  DeleteOutlineOutlined,
  NoteAltOutlined,
  Visibility,
} from "@mui/icons-material"

const JobTable = ({
  jobs,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onDetail,
  onUpdate,
  onDelete,
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [isDetail, setIsDetail] = useState(true)
  const [selectedJob, setSelectedJob] = useState({
    job_id: "",
    title: "",
    company_name: "",
    work_type: "",
    job_location: "",
    salary: "",
    date: "",
    tag: "",
  })
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)

  const techOptions = [
    { tag_name: "Java", tag_id: 1 },
    { tag_name: "Golang", tag_id: 2 },
    { tag_name: "Python", tag_id: 3 },
    { tag_name: "Flutter", tag_id: 4 },
    { tag_name: ".Net Core", tag_id: 5 },
    { tag_name: "Ruby", tag_id: 6 },
    { tag_name: "Rust", tag_id: 7 },
    { tag_name: "PHP", tag_id: 8 },
    { tag_name: "Javascript", tag_id: 9 },
    { tag_name: "Kotlin", tag_id: 10 },
    { tag_name: "Swift", tag_id: 11 },
  ]

  const handleOpenDialog = (job, isDetail) => {
    setSelectedJob({
      ...job,
      benefit: Array.isArray(job.benefit)
        ? job.benefit.join(", ")
        : job.benefit,
    })
    setIsDetail(isDetail)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedJob({
      job_id: "",
      title: "",
      company_name: "",
      work_type: "",
      job_location: "",
      salary: "",
      benefit: "",
      date: "",
      tag_name: "",
    })
  }

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId)
    setOpenDeleteConfirm(true)
  }

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false)
    setJobToDelete(null)
  }

  const confirmDelete = () => {
    if (jobToDelete) {
      onDelete(jobToDelete)
      handleCloseDeleteConfirm()
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                No
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Company Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Work Type
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Location
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Salary
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Listing Date
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Tag
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job, index) => (
                <TableRow key={job.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company_name}</TableCell>
                  <TableCell>{job.work_type}</TableCell>
                  <TableCell>{job.job_location}</TableCell>
                  <TableCell>{job.salary ? job.salary : "-"}</TableCell>
                  <TableCell>
                    {new Date(job.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{job.tag_name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        variant='contained'
                        color='info'
                        size='small'
                        onClick={() => handleOpenDialog(job, true)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        variant='contained'
                        color='warning'
                        size='small'
                        onClick={() => handleOpenDialog(job, false)}
                        style={{ marginLeft: "8px" }}
                      >
                        <NoteAltOutlined />
                      </IconButton>
                      <IconButton
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => handleDeleteClick(job.job_id)}
                        style={{ marginLeft: "8px" }}
                      >
                        <DeleteOutlineOutlined />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={jobs.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isDetail ? "Job Details" : "Update Job"}</DialogTitle>
        <DialogContent>
          <Box
            component='form'
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "400px",
            }}
          >
            <TextField
              label='Title'
              name='title'
              value={selectedJob.title}
              onChange={(e) => handleChange(e, setSelectedJob)}
              disabled={isDetail}
              fullWidth
              margin='normal'
            />
            <TextField
              label='Company Name'
              name='company_name'
              value={selectedJob.company_name}
              onChange={(e) => handleChange(e, setSelectedJob)}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label='Work Type'
              name='work_type'
              value={selectedJob.work_type}
              onChange={(e) => handleChange(e, setSelectedJob)}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label='Location'
              name='job_location'
              value={selectedJob.job_location}
              onChange={(e) => handleChange(e, setSelectedJob)}
              disabled={isDetail}
              fullWidth
            />
            <TextField
              label='Salary'
              name='salary'
              value={selectedJob.salary}
              onChange={(e) => handleChange(e, setSelectedJob)}
              disabled={isDetail}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Listing Date'
                value={selectedJob.date ? new Date(selectedJob.date) : null}
                onChange={(newDate) =>
                  handleDateChange(formatDate(newDate), setSelectedJob, "date")
                }
                disabled={isDetail}
                slots={{ textField: (params) => <TextField {...params} /> }}
              />
            </LocalizationProvider>
            <FormControl>
              <InputLabel>Tag</InputLabel>
              <Select
                id='technology-filter-label-drop'
                value={selectedJob.tag_id}
                onChange={(e) => handleChange(e, setSelectedJob)}
                disabled={isDetail}
                fullWidth
                name='tag_id'
                label='Tag'
              >
                <MenuItem value=''>
                  <em>All</em>
                </MenuItem>
                {techOptions.map((option) => (
                  <MenuItem key={option.tagI_id} value={option.tag_id}>
                    {option.tag_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            {isDetail ? "Close" : "Cancel"}
          </Button>
          {!isDetail && (
            <Button
              onClick={() => {
                console.log(selectedJob)
                onUpdate(selectedJob.job_id, selectedJob)
                handleCloseDialog()
              }}
              color='primary'
            >
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color='primary'>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color='error'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default JobTable
