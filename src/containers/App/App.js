import React, { Component } from 'react';
import './App.css';

import Vows from '../../components/Vows/Vows'
import Groups from '../../components/Groups/Groups'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'
import reactTableUtil from '../../services/reactTableUtil'

import CSVReader from 'react-csv-reader'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'


class App extends Component {
  constructor(){
    super();

    this.dataH = new dataHandler();
    this.rTable = new reactTableUtil()

    this.state = {
      vowsNumber: 0,
      columns : [],
      groups : [],
      students : [],
      rtColumns: [{dataField: 'idVent', text: 'Vide'}]
    }
  }

  handleData(data){
    data = this.dataH.preProcess(data);
    data = this.dataH.createIds(data);
    var cols = this.dataH.getColumns(data);

    this.setState({
        columns : cols,
        groups : ["Hilaire","JB","Alex"],
        students : data,
        rtColumns: this.rTable.columnParser(cols, this.state.groups)
    })
  }

  handleDataError(e){
    console.log("error")
  }

  changeValue(e){
    let value = e.target.value
    let key = e.target.id
    if(this.state.columns[key].state === "vow"){
      this.state.vowsNumber--
      this.state.columns[key].vowNum=-1
    }
    if(value === "vow"){
      this.state.columns[key].vowNum=this.state.vowsNumber
      this.state.vowsNumber++
    }
    this.state.columns[key].state=value
    this.setState({
      columns: this.state.columns,
      rtColumns: this.rTable.columnParser(this.state.columns, this.state.groups),
      vowNumber: this.state.vowsNumber,
      groups:this.dataH.getGroups(this.state.students, this.state.columns)
    })
  }

  loadState(){

  }

  saveState(){
    var fileDownload = require('js-file-download');
    var data = encodeURIComponent(JSON.stringify(this.state));
    fileDownload(data, 'state.json');
  }

  render() {
    return (
      <Container fluid={true} >
        <Jumbotron>
        <h1>Ventilation</h1>
        {/*<span>Load state </span><input type="file"/>
        <span>Save state </span><button onClick={this.saveState.bind(this)}>Save state</button>
        */}
        <CSVReader
                cssClass="csv-reader-input"
                //label="Select CSV"
                onFileLoaded={this.handleData.bind(this)}
                onError={this.handleDataError}
                parserOptions={{header: true, encoding: "UTF-8"}}
                inputId="limeSurvey"
        />
        </Jumbotron>
        <Vows vowNumber={this.state.vowNumber} changeValue = {this.changeValue.bind(this)} columns = {this.state.columns}/>
        <Groups groups = {this.state.groups} /*loadData = {this.loadData.bind(this)}*//>
        <Affectations students = {this.state.students} rtColumns = {this.state.rtColumns}/>
      </Container>
    );
  }
}

export default App;