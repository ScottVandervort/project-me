import React from 'react';

class SimpleAjax extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        messageFromServer : null,
        isLoaded: false,
        error: null,
      };
    }  
  
    componentDidMount() {        

        fetch(  "http://localhost:3000/data/test", 
                {   method: 'POST',
                    mode: 'cors'})
            .then(res => res.json())
            .then((result) => {                                 
              
              this.setState( 
                  { messageFromServer : result.msg,
                    isLoaded : true } );                                    
              },        
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
              })              
        }


        render() {
          const { error, isLoaded, messageFromServer } = this.state;

          if (error) {                                
            return (
              <div> 
                <div>Error: {error.message}</div>
              </div>);
          } else if (!isLoaded) {
            return (
              <div>         
                <div>Loading...</div>
            </div>);
          } else {
            return (              
              <div>           
                <div>Server Response : {messageFromServer}</div>
              </div>
            );
          }
        }      
  }
    
  export default SimpleAjax;