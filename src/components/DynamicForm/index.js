import React from 'react';
import { Button, Form, InputGroup, FormControl, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Card from '@material-ui/core/Card';
import './dynamicForm.css';

class DynamicForm extends React.Component {
    constructor(props) {
        super(props);

    }

    onChangeValue = (e, key) => {
        this.setState({
            [key]: e.target.value
        })
    }
    onOptionSelect = (value, key) => {
        this.setState({
            [key]: value
        })
    }

    renderForm = () => {
        let model = this.props.model;
        let ulElements = model.map((item, elementIndex) => {
            if (item.type == 'text' || item.type == 'number') {
                return (
                    <div className="inputContainer clearfix" key={item.key}>
                        <div className="inputField">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-default">{item.label}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl aria-label={item.label} {...item.props} type={item.type} onChange={(e) => { this.onChangeValue(e, item.key) }} />
                            </InputGroup>
                        </div>
                        <Button className="removeButton" onClick={() => this.props.removeElement(elementIndex)}><HighlightOffIcon /></Button>
                    </div>
                )
            } else if (item.type == 'radio') {
                return (
                    <div className="inputContainer clearfix" key={item.key}>
                        <div className="inputField">
                            <label className="radio-label">{item.label}</label>
                            <div className="radio-options">
                                {item.options.map((option) => {
                                    return <div key={option.key}>
                                        <input type={item.type} value={option.label} name={item.label}
                                            onChange={(e) => { this.onChangeValue(e, item.key) }}
                                        ></input>
                                        <label>{option.label}</label>
                                    </div>
                                })}
                            </div>
                        </div>
                        <Button className="removeButton" onClick={() => this.props.removeElement(elementIndex)}><HighlightOffIcon /></Button>
                    </div>
                )
            } else if (item.type == 'dropdown') {
                return (
                    <div className="inputContainer clearfix" key={item.key}>
                        <div className="inputField">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-default">{item.label}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {(this.state && this.state[item.key]) || 'Select Option'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {item.options.map((option) => {
                                            return <Dropdown.Item eventKey="1" key={option.key} value={option.value} onClick={(e) => { this.onOptionSelect(option.value, item.key) }} active={this.state && this.state[item.key] == option.value}>{option.label}</Dropdown.Item>
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </InputGroup>
                        </div>
                        <Button className="removeButton" onClick={() => this.props.removeElement(elementIndex)}><HighlightOffIcon /></Button>
                    </div>
                )
            } else if (item.type == 'textarea') {
                return (
                    <div className="inputContainer clearfix" key={item.key}>
                        <div className="inputField">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{item.label}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl as="textarea" aria-label={item.label} key={item.key} onChange={(e) => { this.onChangeValue(e, item.key) }} />
                            </InputGroup>
                        </div>
                        <Button className="removeButton" onClick={() => this.props.removeElement(elementIndex)}><HighlightOffIcon /></Button>
                    </div>
                )
            }
        })
        return ulElements
    }

    submitForm = (e) => {
        e.preventDefault();
        console.log('Form Submited', this.state)
    }
    render() {
        return (
            <div className="dynamic-form container" >
                <div className="cardClass">
                    <h3>Final Form</h3>
                    <Form className="formClass" onSubmit={(e) => this.submitForm(e)}>
                        {this.renderForm()}
                        <Button className="submit-btn" variant="outline-primary" type="submit">Submit</Button>
                    </Form>
                    <Button className="add-component-btn" variant="outline-primary" onClick={() => this.props.addComponent()}>Add Component</Button>
                </div>
                <div className="jsonClass">
                    <h3>Json Output</h3>
                    <pre className="pre">{this.props.model && this.props.model.map((ele) => {
                        return JSON.stringify(ele, null, 2)
                    })}</pre>
                    {this.state &&
                        <React.Fragment>
                            <h3>Form Output</h3>
                            <pre className="pre">{JSON.stringify(this.state, null, 2)}</pre>
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }

};


export default DynamicForm;