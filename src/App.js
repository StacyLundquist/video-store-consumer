import VideoSearch from './components/VideoSearch';
import VideoLibrary from './components/VideoLibrary';
import CustomerList from './components/CustomerList';
import axios from 'axios';
import moment from 'moment';

import './components/CustomerList.css'
import {Table} from 'react-bootstrap';

import React, { Component } from 'react';
import './App.css';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      chosenCustomer: {},
      chosenVideo: {},
      message: null,
    }
  }

  selectCustomer = (chosenCustomer) => {
    this.setState({chosenCustomer})
  }

  selectVideo = (chosenVideo) => {
    this.setState({chosenVideo})
  }

  setMessage = (message) => {
    this.setState({message})
  }

  resetRentalQueue = () => {
    console.log('Rental Queue CLEARED');
    this.setState({
      chosenCustomer: {},
      chosenVideo:{},
    })
  };
  
  checkoutVideo = () => {
    if (this.state.chosenVideo && this.state.chosenCustomer) {
      const title = this.state.chosenVideo.title    
      const dueDate = new Date(new Date().getTime()+(1*24*60*60*1000))
      const params = {
        'customer_id': this.state.chosenCustomer.id,
        'video_id': this.state.chosenVideo.id,
        'due_date': dueDate
      }
    
      const checkoutURL = this.API_URL + `/rentals/${title}/check-out`;

      axios.post(checkoutURL, params)
      .then(() => {
        this.setMessage(`${this.state.chosenVideo.title} was successfully checked out to ${this.state.chosenCustomer.name}`);
        this.resetRentalQueue();
      })
      .catch((error) => {
        this.setMessage(error.message)
      });
    } else {
      this.setMessage('Nothing done, make sure you have a customer and video selected')
    }
  }

  visibility = () => {
    if (this.state.chosenCustomer.name && this.state.chosenVideo.title) {
      return ''
    } else {
      return 'disabled'
    }
  }

  API_URL = 'http://localhost:3000'
  

  render() {
    
    return (
      <Router>
        
      <div>
        <nav className='navigation'>
          <Table className="table-sm customer-table__table">
                <thead>
                    <tr className="customer-table__header-row">
                        <th scope="col">Selected Customer</th>
                        <th scope="col">Selected Video</th>
                        <th scope="col">CHECKOUT</th>
                        <th scope="col">Video</th>
                        <th scope="col">Video</th>
                        <th scope="col">Customer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="customer-table__table-row">
            <td>{this.state.chosenCustomer.name}</td>
            <td>{this.state.chosenVideo.title}</td>
            <td><button onClick={this.checkoutVideo} className= { `button button-large ${ this.visibility() }` }>
                Check out {this.state.chosenVideo.title} to {this.state.chosenCustomer.name}
              </button></td>
            <td><Link to='/search'>SEARCH</Link></td>
            <td><Link to='/library'>LIBRARY</Link></td>
            <td><Link to='/customers'>LIST</Link></td>
        </tr>
                </tbody>
            </Table>
          <p> {this.state.message} </p>
        </nav>

        <Switch>
          <Route path="/search"
            component={ props =>
            <VideoSearch { ...props }/>
            }/>
          <Route path="/library"
            component={ props => 
            <VideoLibrary { ...props } selectVideoCallback={this.selectVideo} />
            }/>
          <Route path="/customers" 
            component={ props => 
            <CustomerList { ...props }
            selectCustomerCallback={this.selectCustomer}
            url={this.API_URL}/>
          }/>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );


function Home() {
  return <h2>Home</h2>;
}

function Library() {
  return <h2>About</h2>;
}

  };
};


export default App;