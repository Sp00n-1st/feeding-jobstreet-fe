const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

export const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export const handleDateChange = (newDate, setSelectedJob, name) => {
  if (newDate) {
    setSelectedJob((prevJob) => ({
      ...prevJob,
      [name]: newDate,
    }))
  }
}

export const handleChange = (e, setSelectedJob) => {
  const { name, value } = e.target
  console.log(name)
  console.log(value)
  setSelectedJob((prevJob) => ({
    ...prevJob,
    [name]: value,
  }))
}
