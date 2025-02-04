import { InputProps, InputEvent, FormEvent, ClickEvent, KeyEvent } from "../../types/index";

import { Form, Dropdown, InputGroup, Button } from 'react-bootstrap';

import './input.css';
import { useState, useRef, useEffect } from "react";


// function normalizeText(text: string) {
//     // Remove whitespaces
//     text = text.trim();

//     // Remove whitespace between "-"
//     text = text.replace(/\s+-\s+/g, '-');

//     // Case & šumnik insensitive
//     text = text.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match] ?? match);

//     return text;
// }

// Custom validation texts
function validate(event: any) {
    const input = event.target;
    const validityState = input.validity;

    if (validityState.valueMissing) {
        input.setCustomValidity("Polje ne sme biti prazno");
    }
    else if (validityState.tooShort) {
        input.setCustomValidity("Polje mora vsebovati vsaj 2 znaka");
    }
    else if (validityState.tooLong) {
        input.setCustomValidity("Polje ne sme biti daljše od 40 znakov");
    }

    input.reportValidity();
    
    input.setCustomValidity("");
}

export default function Input({ inputValue, setInputValue, handleGuess, numberOfGuesses, obcine }: InputProps) {  
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const dropdownRef = useRef<HTMLDivElement>(null); 

    // Update value with new value
    function handleInputChange(event: InputEvent) {
        const value = event.target.value;

        setInputValue(value);

        const filteredObcine = obcine.filter((obcina) => // not using filterObcine() because it gets out of sync
            obcina.toLowerCase().includes(value.toLocaleLowerCase().trim())
        );      

        // Enable dropdown after typing smth and false when no obcine found
        setDropdownVisible(value.trim().length > 0 && filteredObcine.length > 0);

        setSelectedIndex(0);
    }
    
    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        handleGuess(inputValue);

        // Clear text from input bar
        setInputValue('');
        setSelectedIndex(0);
        setDropdownVisible(false);
    }

    // Cycle through dropdown items
    function handleKeyDown(event: KeyEvent) {
        const filteredObcine = filterObcine();
  
        if (event.key === "ArrowDown") {
            setSelectedIndex(prevIndex => Math.min(prevIndex + 1, filteredObcine.length - 1)); // prevent going off dropdown list size 
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault(); // prevent the caret cursor from moving left
            setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
        }
        else if (event.key === "Enter" && dropdownVisible) {
            event.preventDefault(); // prevent form submission
            handleSelect(filteredObcine[selectedIndex]);
        }   
    }

    function handleSelect(selectedText: string) {
        setInputValue(selectedText);
        setDropdownVisible(false);
        setSelectedIndex(0);
    }

    // Scroll dropdown on selectedIndex change
    useEffect(() => {
        const dropdownElement = dropdownRef.current;
        if (!dropdownElement) 
            return;

        const items = dropdownElement.querySelectorAll(".dropdown-option");
        if (items.length === 0) 
            return;

        const itemHeight = items[0].clientHeight;
        const dropdownHeight = dropdownElement.clientHeight;
        const offset = selectedIndex * itemHeight;

        // Scroll down
        if (offset + itemHeight > dropdownElement.scrollTop + dropdownHeight) {
            dropdownElement.scrollTop += itemHeight;
        } 
        // Scroll up
        else if (offset < dropdownElement.scrollTop) {
            dropdownElement.scrollTop -= itemHeight; 
        }
    }, [selectedIndex]);

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
    
    // TODO: nared to bols
    // Filter obcine based on inputValue
    function filterObcine() {
        // const normalizedInput = normalizeText(inputValue);
        const x = obcine.filter(obcina => 
            obcina.toLowerCase().includes(inputValue.toLowerCase().trim())    // startsWith or include ????
            // normalizeText(obcina).includes(normalizedInput)
        );

        // Sort by "alphabet"
        x.sort();

        return x;
    }

    const filteredObcine = filterObcine();
    // const filteredObcine = useCallback(() => filterObcine(), [allFeatures]);

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Form.Control id="inputId" placeholder="Vpiši občino" type="text" minLength={2} maxLength={40} value={inputValue} autoComplete="off"
                                  onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} required onInvalid={validate} />
                    
                    <InputGroup.Text id="side-btn-container">
                        <Button className="rounded-0" id="side-btn" type="submit">{numberOfGuesses} / 5</Button>
                    </InputGroup.Text>
                </InputGroup>
            </Form>
            
            {/* Conditionally render the Dropdown */}
            {dropdownVisible && (
                <Dropdown className="dropdown-list" ref={dropdownRef} drop="up">
                    {/* Render every obcina */}
                    {filteredObcine.map((obcina, index) => (
                        <Dropdown.Item className={`dropdown-option ${selectedIndex === index ? "highlighted" : ""}`} key={index} onMouseDown={handleDropdownClick}>{obcina}</Dropdown.Item>
                    ))}
                </Dropdown>
            )}
        </>
    )
}