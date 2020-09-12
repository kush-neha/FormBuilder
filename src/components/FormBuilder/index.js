import React from 'react';
import DynamicForm from '../DynamicForm'
import { Modal, Button, InputGroup, Form, FormControl } from 'react-bootstrap';
import './FormBuilder.css'

class FormBuilder extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            model: [],
            newElementType: null,
            elemenSpecificationForm: null,
            fieldName: null,
            required: false,
            minLength: null,
            maxLength: null,
            errorMessage: null,
            optionsElementArray: [],
            options: []
        }
    }

    setElementSpecifications = (e, newElementType) => {
        e.preventDefault();
        let alreadyAvailableFiel = (this.state.model.length != 0) ? this.state.model.filter((field) => field.key == this.state.fieldName) : [];
        if (alreadyAvailableFiel.length != 0) {
            this.setState({ errorMessage: "Field name already used." });
            return;
        }
        if ((newElementType == 'radio' || newElementType == 'dropdown') && this.state.options.length == 0) {
            this.setState({ errorMessage: "Add minimum one option." });
            return;
        }
        e.preventDefault();
        let model = this.state.model;
        let newElementModel = {
            key: this.state.fieldName,
            label: this.state.fieldName,
            type: newElementType
        };
        if (newElementType == 'text' || newElementType == 'number') {
            newElementModel.props = {
                required: this.state.required,
                minLength: this.state.minLength,
                maxLength: this.state.maxLength
            }
        } else if (newElementType == 'radio' || newElementType == 'dropdown') {
            newElementModel.options = this.state.options;
        }
        model.push(newElementModel);
        let newModel = JSON.stringify(model)
        this.setState({ model, ...newModel, elemenSpecificationForm: null });
    }
    setOptionLabel = (e, index) => {
        let options = this.state.options;
        options.map((item, i) => {
            if (i == index) item.key = item.value = item.label = e.target.value;
        })
        this.setState({ options, errorMessage: null });
    }
    addOptionToElementArray = () => {
        let optionsElementArray = this.state.optionsElementArray;
        let index = optionsElementArray.length;
        optionsElementArray.push(
            <InputGroup className="mb-3" key={Math.random()}>
                <InputGroup.Prepend>
                    <InputGroup.Text>Option Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type="text" onChange={(e) => this.setOptionLabel(e, index)} required />
            </InputGroup>
        )
        let options = this.state.options;
        options.push({ key: Math.random(), value: '', label: '' });
        this.setState({ optionsElementArray, options });
    }
    addElementToArray = (newElementType) => {
        this.setState({ optionsElementArray: [], options: [] });
        let elemenSpecificationForm = null;
        if (newElementType == 'text' || newElementType == 'number' || newElementType == 'textarea') {
            elemenSpecificationForm = <React.Fragment>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-default">Minimum Length</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl id="minLength" type="number" onChange={(e) => this.setState({ minLength: e.target.value })} />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-default">Maximum Length</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl id="dmaxLength" type="number" onChange={(e) => this.setState({ minLength: e.target.value })} />
                </InputGroup>
            </React.Fragment>
        } else if (newElementType == 'radio' || newElementType == 'dropdown') {
            elemenSpecificationForm = <Button variant="outline-primary" onClick={() => { this.addOptionToElementArray(); }}>Add Option</Button>
        }
        this.setState({ showItemSelectionModal: false, elemenSpecificationForm, newElementType });
    }
    removeElement = (index) => {
        let model = this.state.model;
        model.splice(index, 1);
        this.setState({ model });
    }

    render() {
        return (
            <div className="parent-container">
                {this.state.model.length != 0 && <DynamicForm model={this.state.model} removeElement={(index) => this.removeElement(index)} addComponent={() => this.setState({ showItemSelectionModal: true })} />}
                {this.state.model.length == 0 && <Button variant="outline-success" onClick={() => this.setState({ showItemSelectionModal: true })}>Add Component</Button>}
                <Modal show={this.state.showItemSelectionModal} onHide={() => this.setState({ showItemSelectionModal: false })} >
                    <Modal.Header closeButton>
                        <Modal.Title>Select Element</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button className="elementButton" variant="outline-primary" onClick={() => { this.addElementToArray('text'); }}>Text Input</Button>
                        <Button className="elementButton" variant="outline-primary" onClick={() => { this.addElementToArray('number'); }}>Number Input</Button>
                        <Button className="elementButton" variant="outline-primary" onClick={() => { this.addElementToArray('radio'); }}>Radio Button</Button>
                        <Button className="elementButton" variant="outline-primary" onClick={() => { this.addElementToArray('textarea'); }} >TextArea Input</Button>
                        <Button className="elementButton" variant="outline-primary" onClick={() => { this.addElementToArray('dropdown'); }} >Dropdown</Button>
                    </Modal.Body>
                </Modal>

                {/* Element Specification Addition Modal */}
                <Modal show={this.state.elemenSpecificationForm && true} onHide={() => this.setState({ elemenSpecificationForm: null, newElementType: null })} >
                    <Modal.Header closeButton>
                        <Modal.Title>Fill the required details for {this.state.newElementType} element</Modal.Title>
                    </Modal.Header>
                    {this.state.errorMessage && <div className="error">{this.state.errorMessage}</div>}
                    <Form onSubmit={(e) => this.setElementSpecifications(e, this.state.newElementType)}>
                        <Modal.Body>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Field Name</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl type="text" onChange={(e) => this.setState({ fieldName: e.target.value, errorMessage: null })} required />
                            </InputGroup>
                            {this.state.optionsElementArray && this.state.optionsElementArray.map((option) => { return option })}
                            {this.state.elemenSpecificationForm}
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Is Mandatory Field" onChange={(e) => this.setState({ required: e.target.value })} />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-primary" type="submit">Create Element</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        );
    }

}

export default FormBuilder;