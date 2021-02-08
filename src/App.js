import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './component/Navigation/Navigation';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Register/Register';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import './App.css';
import { render } from '@testing-library/react';
import { response } from 'express';

const app = new Clarifai.App({
  apiKey: '0cb257a6be3545228c4f204683ea846b'
 });

const particlesOptions = {
  particles: {
    number: {
      value:30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component  {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  

  calculateFaceLocation = (data) =>{
    const clarifaFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol:clarifaFace.left_col * width,
      topRow: clarifaFace.top_row * height,
      rightCol: width - (clarifaFace.right_col *width),
      bottomRow: height - (clarifaFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        'c0c0ac362b03416da06ab3fa36fb58e3',
        this.state.input   
      )
      .then(response => {
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => {
        console.log(err);
      });
  }

  onRouteChange = (route) => {
    if(route ==='signout'){
      this.setState({isSignedIn:false})
    }else if (route ==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render(){
  return (
    <div className="App">
      <Particles className='particles'
                params={particlesOptions} />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' 
        ? <div> 
          <Logo />
          <Rank />
          <ImageLinkForm 
          onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
        : (
            this.state.route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
        )
  }
    </div>
  );
}
}

export default App;
