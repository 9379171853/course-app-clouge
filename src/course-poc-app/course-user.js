import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import './shared-styles.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-input/paper-textarea.js';

/**
 * @customElement
 * @polymer
 */
class CourseUser extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        super.ready();
    }
    
    connectedCallback(){
        super.connectedCallback();

        let userName = JSON.parse(localStorage.userData).userName;
        let ajaxData = {"emailId":userName};
        this._generateAjaxCall('http://localhost:3000/course/rest/myEnrolledCourses','POST',ajaxData);
        
        this.$.updateStatusForm.addEventListener('iron-form-submit', function(event) {         
                    this.ajaxFlag = 'updateStatus';
                    let teachingValue = (this.$.teachingCheckbox.checked)?'YES':'NO';
                    let ajaxData = {
                        'comments':event.detail.comments,
                        'status':event.detail.status, 
                        'teachOthers':teachingValue,
                        'courseId':this.selectedCourseId,
                        'emailId':JSON.parse(localStorage.userData).userName
                    };
                   this._generateAjaxCall('http://localhost:3000/course/rest/updateStatus','POST',ajaxData);
        }.bind(this));
    }
//<app-localstorage-document key="userData" data="{{userData}}">     </app-localstorage-document>
    static get template(){
        return html`
    <iron-ajax id="ajaxMyCourseCall" on-response="_handleResponse" handle-as="json" content-type="application/json"></iron-ajax>
     
    <style is="custom-style"></style>
      <style include="shared-styles">
        paper-button{
            background: blue;
            color: white;
            height: 100%;
            border-radius: 5px; 
         }
         paper-dropdown-menu: {
    position: absolute !important;
    top: 8px !important;
    right: 8px !important;
};
      </style>     
      <div class="card">              
      <h2>My Courses</h2>
      <vaadin-grid theme="row-dividers" column-reordering-allowed multi-sort items="[[courseList]]">
        <vaadin-grid-sort-column width="9em" header="COURSE ID" path="COURSE_ID"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" header="COURSE NAME" path="COURSE_NAME"></vaadin-grid-sort-column>        
        <vaadin-grid-sort-column width="9em" header="STATUS" path="STATUS"></vaadin-grid-sort-column>  
        <vaadin-grid-sort-column width="9em" header="TEACHING OTHERS">
        <template>
        [[checkTeachValue(item.TEACHOTHERS)]]</template>
        </vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" header="COMMENTS" path="COMMENTS"></vaadin-grid-sort-column>         
      <vaadin-grid-column width="100px">
      <template class="header">ACTION</template>
      
      <template>    
      <paper-button on-click="_updateStatus" style="background-color:#099013; height:30px;">UPDATE</paper-button>
      </template>
 
      </vaadin-grid-column>
    </vaadin-grid>

      </div>
<paper-dialog id="updateStatusDialog" style="width:600px;padding:10px;" no-cancel-on-outside-click with-backdrop>
  <h2>Update Status</h2>
  <paper-dialog-scrollable>
        <iron-form id="updateStatusForm">
            <form>
                <paper-textarea name="comments" auto-validate required label="Comments" error-message="Enter Comments"></paper-textarea>
                <paper-dropdown-menu label="Change Status" required name="status">
                        <paper-listbox slot="dropdown-content">
                        <template is="dom-repeat" items="[[courseStatus]]">
                        <paper-item>[[item]]</paper-item>
                        </template>
                        </paper-listbox>
                </paper-dropdown-menu><br /><br />
                <paper-checkbox name="teaching" id="teachingCheckbox" checked>Teaching Others</paper-checkbox><br />
                <br />
                <div id="updateStatusError"></div>
                <paper-button autofocus id="addCourseButton" raised on-click="_updateStatusForm">UPDATE</paper-button>                
                <paper-button dialog-dismiss>Cancel</paper-button>
            </form>
        </iron-form>
        </paper-dialog-scrollable>  
</paper-dialog>
  
        `;
    }
    static get properties(){
        return {
            courseList:{
                type: Object
            },
            courseStatus:{
                type: Array,
                value: ['Completed','In Progress', 'Not Yet Started']
            },
            selectedTab:{
                type: Boolean,
                value: 0,
                notify:true
            },
            ajaxFlag:{
                type:String,
                value:"all"
            },
            selectedCourseId:{
                type:Number,
                notify:true
            }
        }
    }
    _generateAjaxCall(url,method,data){
        let ajaxEle = this.$.ajaxMyCourseCall;
        ajaxEle.url = url;
        if(method == 'POST'){
            ajaxEle.contentType='application/json';
            ajaxEle.body= JSON.stringify(data);
        }
        ajaxEle.method = method;
        ajaxEle.generateRequest();
    }
    _handleResponse(event){
        let ajaxEleId = this.ajaxFlag;
        if(ajaxEleId == 'all'){
            this.courseList = event.detail.response;
            this.ajaxFlag ='all';
        }else if(ajaxEleId == 'updateStatus'){ 
            this.ajaxFlag = 'all';
            let userName = JSON.parse(localStorage.userData).userName;
            this._generateAjaxCall('http://localhost:3000/course/rest/myEnrolledCourses','POST',{"emailId":userName});
             this.$.updateStatusDialog.toggle();
        }else{}
        
    }
    _updateStatus(event){
        this.selectedCourseId = event.model.__data.item.COURSE_ID;
        this.$.updateStatusDialog.open();
    }
    _updateStatusForm(event){ 
        if(this.$.updateStatusForm.validate()){            
            this.$.updateStatusForm.submit();
        }
    }
    checkTeachValue(value){
        return (value == 'YES')?'YES':'NO';
    }
}

customElements.define('course-user',CourseUser);