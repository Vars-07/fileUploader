import React, { Component } from 'react';
import './app.css';
import Upload from './components/Upload';

export default class App extends Component {

  render() {
    return (
      <div className="app">
        <div className="card">
          <Upload />
        </div>
      </div>
    );
  }
}
