// Greeter.js

//Greeter,js
import React, {Component} from 'react'
import config from './config.json';
import './Greeter.less';//导入
import styles from './Greeter.css';//导入
class Greeter extends Component{
  render() {
    return (
     <div>
       <div className={styles.root}>
           {config.greetText}
       </div>
       <div className="zjl">
         <ul>
           <li>1</li>
           <li>2</li>
           <li>3</li>
             <li>3</li>
             <li>3</li>
             <li>3</li>
         </ul>
       </div>
     </div>
    );
  }
}

export default Greeter
