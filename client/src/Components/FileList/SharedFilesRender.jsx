import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import FileList from "./FileList";

const SharedFilesRender = () => {

    const [files,setFiles]=useState([]);
    const user=useSelector((state)=>state.user);
    const render=useSelector((state)=>state.render);
    const token=useSelector((state)=>state.token);
    const id=user._id;
    console.log(id);
    const getFile = async () => {
        const response = await fetch(`http://localhost:3001/getsharedfile/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data);
        setFiles(data);
      };
      useEffect(()=>{
        getFile();
      },[]);
      useEffect(()=>{
        getFile();
      },[render]);
  
  
    return (
      <div style={{marginTop:'2rem'}}>
        <h1>Shared Files</h1>
        <FileList sharedFiles={true} files={files} />
      </div>
    );
  };
  
  export default SharedFilesRender;