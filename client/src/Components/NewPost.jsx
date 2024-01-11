import { useState } from "react"
import axios from 'axios'

export default function NewPost() {
  const [file, setFile] = useState()
  const [caption, setCaption] = useState("")

  const submit = async event => {
    event.preventDefault()

    const formData = new FormData();
    formData.append("image", file)
    formData.append("caption", caption)
    await axios.post("http://localhost:3001/api/posts", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }

  return (
    <form onSubmit={submit}>
      <input multiple
        webkitdirectory="" directory="" onChange={e => setFile(e.target.files[0])} type="file" accept="image/*, text/*, .pdf, video/*"></input>
      <input value={caption} onChange={e => setCaption(e.target.value)} type="text" placeholder='Caption'></input>
      <button type="submit">Submit</button>
    </form>
  )
}