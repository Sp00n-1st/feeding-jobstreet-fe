import React, { useState, useEffect } from "react"
import JobTable from "./component/tableCom"
import {
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material"
import axios from "axios"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { FaSpinner } from "react-icons/fa"
import { handleChange, handleDateChange } from "./util/util"

function App() {
  const [jobs, setJobs] = useState([])
  const [tag, setTag] = useState("")
  const [tagScrape, setTagScrape] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [openGenerate, setOpenGenerate] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    companyName: "",
    workType: "",
    location: "",
    salary: "",
    date: "",
    tag_id: "",
  })

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleOpenGenerate = () => {
    setOpenGenerate(true)
  }

  const handleCloseGenerate = () => {
    setOpenGenerate(false)
    setTagScrape("")
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setNewJob({
      title: "",
      company_name: "",
      work_type: "",
      job_location: "",
      salary: "",
      date: "",
      tag_id: "",
    })
  }

  const techOptions = [
    { label: "Java", value: 1 },
    { label: "Golang", value: 2 },
    { label: "Python", value: 3 },
    { label: "Flutter", value: 4 },
    { label: ".Net Core", value: 5 },
    { label: "Ruby", value: 6 },
    { label: "Rust", value: 7 },
    { label: "PHP", value: 8 },
    { label: "Javascript", value: 9 },
    { label: "Kotlin", value: 10 },
    { label: "Swift", value: 11 },
  ]

  const fetchJobs = async (filterTag = "") => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:8001/api/v1/jobs", {
        params: { tag: filterTag },
      })
      console.log(`filter tag : ${filterTag}`)
      console.log(response)
      setJobs(response.data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onScrape = async (tagS) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/v1/generate`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          params: {
            tag_id: tagS,
          },
        }
      )
      if (response.status === 200) {
        console.log("Job Scraped successfully", response.data)
        setTag("")
        fetchJobs()
      }
    } catch (error) {
      console.error("Error Scraping jobs:", error)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/v1/job/export-excel`,
        {
          responseType: "blob",
        }
      )

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "jobs_export.xls")
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting jobs:", error)
    }
  }

  const onCreate = async (jobData) => {
    try {
      console.log(jobData)
      const newJobData = {
        ...jobData,
      }
      const response = await axios.post(
        `http://localhost:8001/api/v1/jobs`,
        newJobData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      )
      if (response.status === 201) {
        console.log("Job Created successfully", response.data)
        setTag("")
        fetchJobs()
      }
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  const onUpdate = async (jobId, jobData) => {
    try {
      const updatedJobData = {
        ...jobData,
      }
      const response = await axios.put(
        `http://localhost:8001/api/v1/jobs/${jobId}`,
        updatedJobData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      )
      if (response.status === 200) {
        console.log("Job updated successfully", response.data)
        setTag("")
        fetchJobs()
      }
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  const onDelete = async (jobId) => {
    try {
      console.log("Delete")
      const response = await axios.delete(
        `http://localhost:8001/api/v1/jobs/${jobId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      )
      if (response.status === 204) {
        console.log("Job deleted successfully", response.data)
        setTag("")
        fetchJobs()
      }
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    fetchJobs(tag)
  }, [tag])

  const handleFilterChange = (e) => {
    setTag(e.target.value)
    fetchJobs(tag)
  }

  const handleFilterScrapeChange = (e) => {
    setTagScrape(e.target.value)
  }

  return (
    <div className='m-5'>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        mb={4}
        sx={{
          backgroundColor: "#0d47a1",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          color: "#fff",
        }}
      >
        <Typography variant='h5' component='h5' color='white' fontWeight='bold'>
          Job Vacancy
        </Typography>
      </Box>
      <Box
        mb={3}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <FormControl
          variant='outlined'
          style={{ marginRight: "10px", minWidth: 200 }}
        >
          <InputLabel id='technology-filter-label'>Filter by Tag</InputLabel>
          <Select
            id='technology-filter-label'
            value={tag}
            onChange={handleFilterChange}
            label='Filter by Tag'
          >
            <MenuItem value=''>
              <em>All</em>
            </MenuItem>
            {techOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display='flex' gap={2}>
          <Button variant='contained' color='success' onClick={handleDownload}>
            Download As Excel
          </Button>
          <Button
            variant='contained'
            color='info'
            onClick={() => handleOpenGenerate()}
          >
            Generate Job
          </Button>
          <Button
            variant='contained'
            color='info'
            onClick={() => handleOpenDialog()}
          >
            Create Job
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <FaSpinner className='spinner' size={24} />
        </div>
      ) : (
        <JobTable
          jobs={jobs}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onDetail={(id) => alert(`Show details for job with ID: ${id}`)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Create Job"}</DialogTitle>
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
              value={newJob.title}
              onChange={(e) => handleChange(e, setNewJob)}
              fullWidth
              margin='normal'
            />
            <TextField
              label='Company Name'
              name='companyName'
              value={newJob.companyName}
              onChange={(e) => handleChange(e, setNewJob)}
              fullWidth
            />
            <TextField
              label='Work Type'
              name='workType'
              value={newJob.workType}
              onChange={(e) => handleChange(e, setNewJob)}
              fullWidth
            />
            <TextField
              label='Location'
              name='location'
              value={newJob.location}
              onChange={(e) => handleChange(e, setNewJob)}
              fullWidth
            />
            <TextField
              label='Salary'
              name='salary'
              value={newJob.salary}
              onChange={(e) => handleChange(e, setNewJob)}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Listing Date'
                value={
                  newJob.listingDate
                    ? new Date(newJob.listingDate)
                        .toISOString()
                        .replace(".000Z", "Z")
                    : null
                }
                onChange={(newDate) =>
                  handleDateChange(newDate, setNewJob, "listingDate")
                }
                slots={{ textField: (params) => <TextField {...params} /> }}
              />
            </LocalizationProvider>
            <FormControl>
              <InputLabel>Tag</InputLabel>
              <Select
                id='technology-filter-label'
                value={newJob.tag}
                onChange={(e) => handleChange(e, setNewJob)}
                label='Tag'
                name='tag_id'
                fullWidth
              >
                <MenuItem value=''>
                  <em>All</em>
                </MenuItem>
                {techOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            {"Cancel"}
          </Button>
          <Button
            onClick={() => {
              onCreate(newJob)
              handleCloseDialog()
            }}
            color='primary'
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openGenerate} onClose={handleCloseGenerate}>
        <DialogTitle>{"Generate Job"}</DialogTitle>
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
            <DialogContentText>
              Generate Job by scraping data. Choose a tag to srape job with that
              tag.
            </DialogContentText>
            <FormControl
              variant='outlined'
              style={{ marginRight: "10px", minWidth: 200 }}
            >
              <InputLabel>Tag to Scrape</InputLabel>
              <Select
                value={tagScrape}
                onChange={handleFilterScrapeChange}
                label='Tag to Scrape'
              >
                {techOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerate} color='primary'>
            {"Cancel"}
          </Button>
          <Button
            onClick={() => {
              onScrape(tagScrape)
              handleCloseGenerate()
            }}
            color='primary'
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App
