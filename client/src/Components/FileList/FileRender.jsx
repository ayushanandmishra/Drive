import React from 'react';
import FileList from './FileList'; 
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

const filess = [
  { filename: 'Document.pdf', fileOwner: 'John Doe', fileType: 'pdf' },
  { filename: 'Spreadsheet.txt', fileOwner: 'Jane Smith', fileType: 'txt' },
  { filename: 'RequiremOfDdfdfdfdfffdfdfdfdfdfdfdfdfdfdfdfdfdf.video', fileOwner: 'Jane Smith', fileType: 'video' },
  { filename: 'Spreadsheet.img', fileOwner: 'Jane Smith', fileType: 'image' },
];

const App = ({change}) => {

  const [files,setFiles]=useState([]);
  const user=useSelector((state)=>state.user);
  const id=user._id;
  console.log(id);
  const formData=new FormData();
  formData.append("id",id);
  const getFile = async () => {
      const response = await fetch(`http://localhost:3001/getfile/${id}`, {
        method: "GET"
      });
      const data = await response.json();
      console.log(data);
      setFiles(data);
    };
    useEffect(()=>{
      getFile();
    },[]);


  return (
    <div style={{marginTop:'2rem'}}>
      <h1>Your Files</h1>
      <FileList files={files} />
    </div>
  );
};

export default App;