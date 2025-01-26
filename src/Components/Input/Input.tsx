import { InputProps, InputEvent, FormEvent, ClickEvent, Features, KeyEvent } from "../../types/index";

import { Form, Dropdown, InputGroup, Button } from 'react-bootstrap';

import './input.css';
import { useState, useRef } from "react";


// Return list of obcine
function getObcine(allFeatures: Features) {
    const obcine: string[] = []; 

    allFeatures.forEach(feature => {
        if (!feature.properties) {
            console.error("Feature properties are empty");
            return;
        }
        const naziv = feature.properties.NAZIV;
        obcine.push(naziv);
    })
    
    return obcine; 
}


export default function Input({ inputValue, setInputValue, handleGuess, numberOfGuesses, allFeatures }: InputProps) {  
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const obcine = allFeatures ?  getObcine(allFeatures) : []; // Weird, allFeatures gets passed undifined and then gives runtime error(allFeatures is undifined)
    const dropdownRef = useRef<HTMLDivElement | null>(null); 

    // Update value with new value
    function handleInputChange(event: InputEvent) {
        const value = event.target.value;
        setInputValue(value);

        // Enable dropdown after typing smth
        setDropdownVisible(value.trim().length > 0);
    }
    
    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        handleGuess(inputValue);

        // Clear text from input bar
        setInputValue('');
        setSelectedIndex(0);
        setDropdownVisible(false);
    }

    function handleKeyDown(event: KeyEvent) {
        const filteredObcine = filterObcine();

        if (event.key === "ArrowDown") {
            setSelectedIndex(prevIndex => Math.min(prevIndex + 1, filteredObcine.length - 1)); // prevent going off dropdown list size 
        }
        else if (event.key === "ArrowUp") {
            setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
        }
        else if (event.key === "Enter" && selectedIndex >= 1) {
            event.preventDefault(); // prevent form submission
            handleSelect(filteredObcine[selectedIndex]);
        }
        scrollDropdown();
    }

    function scrollDropdown() {
        const dropdownElement = dropdownRef.current;

        if (!dropdownElement) {
            console.error("Dropdown element is empty");
            return;
        }

        const items = dropdownElement.querySelectorAll(".dropdown-option");
        if (items.length === 0) {
            console.error("Item length is 0");
            return;
        }

        const itemHeight = items[0].clientHeight; // Get the height of the first item
        const dropdownHeight = dropdownElement.clientHeight;
        const offset = selectedIndex * itemHeight + itemHeight; // + itemHeight, when index === 0

        console.log("Item height: ", itemHeight);
        console.log("Dropdown height: ", dropdownHeight);
        console.log("Offset: ", offset);
        console.log("Dropdown element: ", dropdownElement.scrollTop);
        console.log("--------");

        // TODO: FIX THIS SHIT MOVING UP GAY

        // Scroll logic
        if (offset + itemHeight > dropdownElement.scrollTop + dropdownHeight) {
            dropdownElement.scrollTop += itemHeight; // Scroll down
        }
        else if (offset - itemHeight < dropdownElement.scrollTop + itemHeight) {
            dropdownElement.scrollTop -= itemHeight; // Scroll up
        } 
    }

    function handleSelect(selectedText: string) {
        setInputValue(selectedText);
        setDropdownVisible(false);
        setSelectedIndex(0);
    }

    // Disable dropdown on unfocus
    function handleBlur() {
        setDropdownVisible(false);
        setSelectedIndex(0);
    }

    // Update value with selected dropdown item
    function handleDropdownClick(event: ClickEvent) {
        const selectedText = event.currentTarget.textContent;

        if (selectedText) {
            setInputValue(selectedText);
        }
        setDropdownVisible(false);

        event.preventDefault(); // stays focused on input
    }

    // Filter obcine based on inputValue
    function filterObcine() {
        const filteredObcine = obcine.filter((obcina) => 
            obcina.toLowerCase().startsWith(inputValue.toLocaleLowerCase().trim())    // startsWith or include ????
        );

        return filteredObcine;
    }

    const filteredObcine = filterObcine();
    // const filteredObcine = useCallback(() => filterObcine(), [allFeatures]);

    return (
        <div className="col-lg-6 offset-lg-3 mt-3">
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Form.Control placeholder="Vpiši občino" type="text" value={inputValue} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} required />
                    <InputGroup.Text id="side-btn-container">
                        <Button className="rounded-0" id="side-btn" type="submit">{numberOfGuesses} / 5</Button>
                    </InputGroup.Text>
                </InputGroup>
                {/* <Button type="submit" className="btn btn-secondary col-lg-12"> {numberOfGuesses} / 5 </Button> */}
            </Form>
            
            {/* Conditionally render the Dropdown */}
            {dropdownVisible && (
                <Dropdown className="dropdown-list" ref={dropdownRef} >
                    {/* Render every obcina */}
                    {filteredObcine.map((obcina, index) => (
                        <Dropdown.Item className={`dropdown-option ${selectedIndex === index ? "highlighted" : ""}`} key={index} onMouseDown={handleDropdownClick}>{obcina}</Dropdown.Item>
                    ))}
                </Dropdown>
            )}
        </div>        
    )
}