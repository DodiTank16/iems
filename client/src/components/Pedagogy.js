import React from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styled from "styled-components";
import  "../Pedagogy.css";

const Button = styled.button`
color: #FFFFFF !important;
text-transform: uppercase;
font-size: 16px;
text-decoration: none;
width: 46.5%;
background: #4eb5f1;
padding: 15px;
border-radius: 10px;
display: inline-block;
border: none;
position: sticky;
align-self: center;
left: 44%;
top: 110%;  
margin: 1% 0% 5% 37%;
`;

const Pedagogy =()=>{
    return (
      <Paper className='wrapper' elevation={10}>
        <h1>PEDAGOGY</h1>
        <form className='FormP'>
        <label for="subject">Academic Year:</label>
        <Select className="Dropdown"
          variant="outlined"
          placeholder="Select"
        >
          <MenuItem value={1}>2015-2016</MenuItem>
          <MenuItem value={2}>2016-2017</MenuItem>
          <MenuItem value={3}>2017-2018</MenuItem>
          <MenuItem value={4}>2018-2019</MenuItem>
          <MenuItem value={5}>2019-2020</MenuItem>
          <MenuItem value={5}>2020-2021</MenuItem>
        </Select>

        <label for="subject">Semester (Odd/Even):</label>
        <Select 
          style = {{width: 150, alignSelf: "center", left: 40, marginBottom: 10}}
          variant="outlined"
          placeholder="Select"
        >
          <MenuItem value={1}>Odd</MenuItem>
          <MenuItem value={2}>Even</MenuItem>
        </Select>


{/* <label for="subject">Semester:</label> */}
        <Select className="Dropdown"
          variant="outlined"
          placeholder="Select"
          style= {{maxWidth: 100}}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={5}>6</MenuItem>
          <MenuItem value={5}>7</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>

        <label for="subject">Subject:</label>

        {/* <Select className="Dropdown"
          variant="outlined"
          placeholder="Select"
          // style = {{width: 250, alignSelf: "center", left: 20, marginBottom: 10}}
        >
          <MenuItem value={1}>DWDA</MenuItem>
          <MenuItem value={2}>HS</MenuItem>
          <MenuItem value={3}>TOC</MenuItem>
          <MenuItem value={4}>IOS</MenuItem>
          <MenuItem value={5}>INS</MenuItem>
        </Select> */}

        <label for="subject">Number of Components:</label>
        <Select className="Dropdown"
          variant="outlined"
          // style = {{width: 250, alignSelf: "center", left: 20, marginBottom: 10}}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>

        <label for="subject">C1-Name:</label>
          <TextField
          id="SName"
          type="text"
          style = {{width: 250, alignSelf: "center", left: 40, marginBottom: 10}}
          variant="outlined"
        />

        <label for="subject">C1-Mode:</label>
        <Select className="Dropdown"
          variant="outlined"
          placeholder="Select"
          // style = {{width: 250, alignSelf: "center", left: 20, marginBottom: 10}}
        >
          <MenuItem value={1}>Online</MenuItem>
          <MenuItem value={2}>Offline</MenuItem>
          <MenuItem value={3}>Quiz</MenuItem>
          <MenuItem value={4}>Written</MenuItem>
          <MenuItem value={5}>Oral</MenuItem>
        </Select>

        <label for="subject">C1-Weightage:</label>
          <TextField
          id="Weightage"
          type="text"
          style = {{width: 250, alignSelf: "center", left: 40, marginBottom: 10}}
          variant="outlined"
        />
          
          <Button className="Sbutton"
            type="submit"
            variant="raised">
            {"Submit"}
          </Button>
          
        </form>
      </Paper>
    );
}

export default Pedagogy;
