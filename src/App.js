import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import Navigation from './component/Navigation/Navigation';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Register/Register';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import './App.css';


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
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entires: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({ user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
        if(response){
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
          })
          })
        
        .then(response => response.json())
        .then(count =>{
            this.setState(Object.assign(this.state.user, {entries:count}))
        } )
        }
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
    const { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Particles className='particles'
                params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home' 
        ? <div> 
          <Logo />
          <Rank
            name={this.state.user.name}
            entries={this.state.user.entries}
          />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
            this.state.route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
  }
    </div>
  );
}
}

export default App;
