import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';

import {Button, Form, FormGroup, Label, FormText, Input} from 'reactstrap';

import './upload.css';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

class Upload extends Component {

    constructor(props){
        super(props);

        this.state = { 
            confirmation: '',
            isLoading: '',
            files: '',
            invoice: '',
            amount: '',
            invoiceDate: '',
            vendor: '',
            description: ''
        }

        this.handleChange = this.handleChange.bind(this)

    }

    
    
    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const value = event.value;
        const name = event.name;

        this.setState({name:value})
    }

    async handleSubmit(event){
        event.preventDefault();
        this.setState({confirmation:"Uploading..."});

    }

    async getFiles(files){
        this.setState({
            isLoading: "Extracting data...",
            files: files
        });

    const UID = Math.round(1 + Math.random() * (1000000-1));

    var date = {
        fileExt: "png",
        imageID: UID,
        folder: UID,
        img: this.state.files[0].base64
    }

    this.setState({confirmation:"Processing..."});

    await fetch('https://bmjqdomvt6.execute-api.us-west-1.amazonaws.com/Production',
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-type": "application.json"
            },
            body: JSON.stringify(date)
        }
    );

    let targetImage = UID + ".png"

    const response = await fetch('https://bmjqdomvt6.execute-api.us-west-1.amazonaws.com/Production/ocr',
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-type": "application.json"
            },
            body: JSON.stringify(targetImage)
        }
    );

    this.setState({confirmation:""});

    const OCRBody = await response.json();
    console.log("Response: ", OCRBody);

    this.setState({amount: OCRBody.body[0]});
    this.setState({invoice: OCRBody.body[1]});
    this.setState({invoiceDate: OCRBody.body[2]})

    }

    render() { 
        const processing = this.state.confirmation;
        return ( 
            <div className='row'>
                <div className='col-6 offset-3'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <h3 className='text-danger'>{processing}</h3>
                            <h6>Upload Invoice</h6>
                            <FormText color='muted'>PNG,JPG</FormText>
                        
                            <div className='form-group files color'>
                                <FileBase64 
                                    multiple={true}
                                    onDone={this.getFiles.bind(this)}
                                    >

                                    </FileBase64>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Invoice</h6>
                            </Label>
                            <Input
                                type="text"
                                name="invoice"
                                id="invoice"
                                required
                                value={this.state.invoice}
                                onChange={this.handleChange}
                                />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Amount ($)</h6>
                            </Label>
                            <Input
                                type="text"
                                name="amount"
                                id="amount"
                                required
                                value={this.state.amount}
                                onChange={this.handleChange}
                                />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Date</h6>
                            </Label>
                            <Input
                                type="text"
                                name="invoiceDate"
                                id="invoiceDate"
                                required
                                value={this.state.invoiceDate}
                                onChange={this.handleChange}
                                />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Vendor</h6>
                            </Label>
                            <Input
                                type="text"
                                name="vendor"
                                id="vendor"
                                required
                                value={this.state.vendor}
                                onChange={this.handleChange}
                                />
                        </FormGroup>
                        
                        <FormGroup>
                            <Label>
                                <h6>Description</h6>
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                id="description"
                                required
                                value={this.state.description}
                                onChange={this.handleChange}
                                />
                        </FormGroup>
                        <Button className='btn btn-lg btn-block  btn-success'>
                            Submit
                        </Button>
                    </Form>

                </div>
            </div>
        );
    }
}
 
export default Upload;