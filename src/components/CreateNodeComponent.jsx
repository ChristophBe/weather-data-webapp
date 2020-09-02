import * as React from "react";
import * as yup from 'yup';
import {Field, Form, Formik} from "formik/dist/index";
import {connect} from "react-redux";
import {CheckboxField, InputField} from "./FormInputFields";
import {NodesService} from "../services/NodesService";
import {Config} from "../config";

class  CreateNodeComponent extends React.Component {
    initialValue = { name: '' ,lat:0, lng:0,is_public:true,is_outdoors:true};

    validationSchema =  yup.object().shape({
        name: yup.string().required("Bitte gib einen Namen an."),

        lat: yup.number().required("Bitte gib eine Latitude an."),
        lng: yup.number().required("Bitte gib eine Longditude an."),
    });


    constructor(props) {
        super(props);

        this.state = {
            success: false,
            failed: false,
            nodeId:0,
            apiToken:"",
        };
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }


    onSubmitForm(values, { setSubmitting, resetForm }){
        const {auth} = this.props

        console.log(values);
        let reqPromise = NodesService.saveNodes(values, auth.token);
        reqPromise.then(
            (data)=>{
                console.log("shareData",data)
                setSubmitting(false);

                this.setState({
                    success: true,
                    failed:false,
                    nodeId:data.id
                });


                NodesService.fetchNodeApiTokenByNodeId(data.id,auth.token).then(
                    (data)=>{
                        this.setState({
                            apiToken:data.token
                        });
                    }
                )
            },
            (err)=>{

                console.log("shareErr",err)
                setSubmitting(false);
                this.setState({
                    success: false,
                    failed:true
                });
            }
        );
        resetForm();
        setSubmitting(false);
    }

    render() {

        const {success,failed,nodeId,apiToken} = this.state;
        if(success){
            return <div>
                <h2>Dein Messstation wurde Erfolgreich angelegt.</h2>

                <div className={"form-group"}>
                    <label>Api endpoint:</label>
                    <input  type={"text"} className={"form-control"} value={Config.apiBaseUrl + "/nodes/" + nodeId + "/measurments"} readOnly/>

                </div>

                <div className={"form-group"}>
                    <label>Api Token:</label>
                    <input  type={"text"} className={"form-control"} value={apiToken} readOnly/>

                </div>

            </div>
        }
        return (
            <div>
                <h1>Messstation anlegen</h1>
                {failed?<div className={"alert alert-danger"}>Es ist ein Fehler aufgetreten.</div> : null}
                <Formik
                    initialValues={this.initialValue}
                    validate={this.validateForm}
                    validationSchema={this.validationSchema}
                    onSubmit={this.onSubmitForm}>
                    {({isSubmitting}) => (
                        <Form>
                            <Field name="name" component={InputField} type={"name"} placeholder={"Name"} label={"Name"}/>
                            <Field name="lat" component={InputField} type={"number"} placeholder={"Latitude"} label={"Latitude"}/>
                            <Field name="lng" component={InputField} type={"number"} placeholder={"Longitude"} label={"Longitude"}/>
                            <Field name="is_public" component={CheckboxField}  placeholder={"Ist Öffentlich"} label={"Ist Öffentlich"}/>
                            <Field name="is_outdoors" component={CheckboxField} placeholder={"Ist Draußen"} label={"Ist Draußen"}/>
                            <button className={"btn btn-outline-light"} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"/> : null}
                                Messstation speichern
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    auth:state.auth,
    nodes:state.nodes
});

const mapDispatchToProps = {};

export default connect(mapStateToProps,mapDispatchToProps)(CreateNodeComponent);