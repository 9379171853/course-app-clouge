import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import './shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class CourseLogin extends PolymerElement{      
    static get template(){
        return html`

    <style is="custom-style"></style>
      <style include="shared-styles">
      .loginForm{
            width:600px !important; 
            margin:0 auto;
            }
            #loginError{
                color:#ff0000;
                border: 1px solid #ff0000;
                display:none;
                padding:10px;
                text-align:center;
            }
      </style>
      <app-localstorage-document key="userData" data="{{userData}}">
      </app-localstorage-document>
      <iron-ajax id="loginCall" on-response="_handleResponse" content-type="application/json" handle-as="json" on-error="_handleError"></iron-ajax>
      <div class="card loginForm">
        <iron-form id="loginForm">
            <form>
                <paper-input type="text" name="userName" value="{{userName}}" auto-validate required label="Email" error-message="Enter Email"></paper-input>
                <paper-input type="password" name="password" value="{{userPwd}}" auto-validate required label="Password" error-message="Enter Password"></paper-input>
                <br />
                <div id="loginError"></div>
                <paper-button name="Submit" raised on-click="_submitForm">LOGIN</paper-button>
                <div></div>
            </form>
        </iron-form>
      </div>
        
        `;
    }
    connectedCallback(){
        super.connectedCallback();
    }
    static get properties(){
        return {
            userName:{
                type: String,
                value:""
            },
            userPwd:{
                type: String,
                value: ""
            },
            userData: {                
                type:Object,
                value:{},
                notify:true
            }
        }
    }
    _submitForm(event){
        if(this.$.loginForm.validate()){
            let ajaxEle = this.$.loginCall;
            ajaxEle.method ="POST";
            ajaxEle.url="http://localhost:3000/users/rest/login";
            ajaxEle.body = {userName: this.userName, password:this.userPwd};
            ajaxEle.generateRequest();
        }
    }
    _handleResponse(event){
        let response = event.detail.response;
        if(response.status == 'success'){
           this.userData = {'userName':this.userName,'isLogin':true};
           this.dispatchEvent(new CustomEvent('checkUserLogin', {bubbles: true, composed: true, detail: {isLogin: true}}));

            document.querySelector('course-poc-app').set('route.path','/home');
        }else{
            this.$.loginError.innerHTML = response.message;
            this.$.loginError.style.display = 'block';
        }
    }
    _handleError(event){
        this.$.loginError.innerHTML = "Invalid User.";
        this.$.loginError.style.display = 'block';
    }

}

customElements.define('course-login',CourseLogin);