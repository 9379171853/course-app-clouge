import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
/**
 * @customElement
 * @polymer
 */
class CourseRegister extends PolymerElement{
 constructor(){
    super();
  }
  ready(){
    super.ready();
    
  this.$.registerForm.addEventListener('change', function(event) {
   //this.$.registerButton.disabled = !this.$.registerForm.validate();
  }.bind(this));
  this.$.registerForm.addEventListener('iron-form-submit', function(event) {
            let ajaxEle = this.$.registerCall;
            ajaxEle.method ="POST";
            ajaxEle.url="http://localhost:3000/users/rest/registerUser";
            delete event.detail.cPassword;
            ajaxEle.body = event.detail;
            ajaxEle.generateRequest();
  }.bind(this));
  }
  connectedCallback(){
    super.connectedCallback();
  }
    
    static get properties(){
        return {
            notifyMessage:{
                type: String
            }
        }
    }
    _submitForm(event){
        if(this.$.registerForm.validate()){            
            this.$.registerForm.submit();
        }
    }
    _resetForm(event){
        this.$.registerForm.reset();
    }
    _handleResponse(event){
        let resp = event.detail.response;
        if(resp.status == 'success'){
            this.notifyMessage = resp.message;
            this.$.notifyMessage.toggle();
            document.querySelector('course-poc-app').set('route.path','/login');

        }else{
            this.$.registerError.innerHTML = "Error in register.";
        }
    }    
    _handleError(event){
        this.$.registerError.innerHTML = "Invalid User.";
        this.$.registerError.style.display = 'block';
    }
    _closeNotifyMessage(){
        this.$.notifyMessage.toggle();
    }
    static get template(){
        return html`

    <style is="custom-style"></style>
      <style  include="shared-styles">
        .registerForm{
            width:600px !important; 
            margin:0 auto;
            }
            #registerError{
                color:#ff0000;
                border: 1px solid #ff0000;
                display:none;
                padding:10px;
                text-align:center;
            }
            paper-button.disabled:{
                    background-color:#ccc;
            }
            paper-b
      </style>
      <iron-ajax id="registerCall" on-response="_handleResponse" content-type="application/json" on-error="_handleError" handle-as="json" url=""></iron-ajax>
      
      <div class="card registerForm">
      <div id="register">
        <iron-form id="registerForm">
            <form>
                <paper-input type="text" name="name" auto-validate required label="User Name" error-message="Enter User Name" min="2" allowed-pattern="[a-zA-Z ]"></paper-input>
                <paper-input type="text" name="sapId" auto-validate required allowed-pattern="[0-9]" label="SAP ID" min="3" error-message="Enter SAP IDs"></paper-input>
                <paper-input type="email" name="emailId" auto-validate required label="Email ID" error-message="Enter Email ID"></paper-input>
                <paper-input type="text" name="primarySkill" auto-validate required label="Primary Skill" error-message="Enter Primary Skill"></paper-input>
                <paper-input type="text" name="band"  auto-validate required label="Band" error-message="Enter Band"></paper-input>
                <paper-input type="password" name="password" min="6"  auto-validate required label="Password" error-message="Enter Password"></paper-input>
                <paper-input type="password" name="cPassword" min="6" auto-validate required label="Confirm Password" error-message="Enter Confirm Password"></paper-input>
                <br />
                <div id="registerError"></div>
                <paper-button name="Submit" id="registerButton" raised on-click="_submitForm">REGISTER</paper-button>
                <paper-button raised on-click="_resetForm">RESET</paper-button>
            </form>
        </iron-form>
        </div>
      </div>
        <paper-toast id="notifyMessage" duration="0" text="[[notifyMessage]]" horizontal-align="right">
  
  <paper-icon-button icon="clear" on-click="_closeNotifyMessage"></paper-icon-button>
</paper-toast>
        `;
    }

}

customElements.define('course-register',CourseRegister);