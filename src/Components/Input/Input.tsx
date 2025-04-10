import { InputProps, InputEvent, FormEvent, ClickEvent, KeyEvent } from "../../types/index";

import { Form, Dropdown, InputGroup, Button } from 'react-bootstrap';

import './input.css';
import { useState, useRef, useEffect } from "react";

// Custom validation texts
function validate() {   
    const input = document.getElementById("inputId") as HTMLInputElement;
    const value = input.value.trim();

    let isValidated = false;

    if (value.length === 0) {
        input.setCustomValidity("Polje ne sme biti prazno");
        isValidated = true;
    } 
    else if (value.length < 2) {
        input.setCustomValidity("Polje mora vsebovati vsaj 2 znaka");
        isValidated = true;
    }
    else if (value.length > 40) {
        input.setCustomValidity("Polje ne sme biti daljše od 40 znakov");
        isValidated = true;
    }
    
    input.reportValidity();

    if (isValidated) {
        input.setCustomValidity("");
    }

    return isValidated;
}

export default function Input({ inputValue, setInputValue, handleGuess, numberOfGuesses, obcine, gameState }: InputProps) {  
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filteredObcine, setFilteredObcine] = useState<string[]>();
    const [placeholderText, setPlaceholderText] = useState<string>("Vpiši občino");
    
    const dropdownRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        if (gameState.win || gameState.lose) {
            setPlaceholderText("Konec igre, jutri lahko ponovno igrate.");
        }
        else {
            setPlaceholderText("Vpiši občino");
        }

    }, [gameState]);

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
        
        if (validate())
            return;

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
            setSelectedIndex(prevIndex => Math.min(prevIndex + 1, filteredObcine.length - 1));
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
        }
        else if (event.key === "Enter" && dropdownVisible) {
            event.preventDefault();
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

    // Change on input change
    useEffect(() => {
        setFilteredObcine(filterObcine());
    }, [inputValue])

    // const filteredObcine = useCallback(() => filterObcine(), [allFeatures]);

    return (
        <>
            <div className="relative m-auto w-full max-sm:w-3/4 max-md:w-1/2 max-lg:w-3/4">
                <Form onSubmit={handleSubmit} >
                    <InputGroup>
                        <Form.Control
                            id="inputId" // for js  
                            placeholder={placeholderText}
                            type="text" 
                            maxLength={40} 
                            value={inputValue} 
                            autoComplete="off"
                            onChange={handleInputChange} 
                            onBlur={handleBlur} 
                            onKeyDown={handleKeyDown}  
                            disabled={gameState.win || gameState.lose}
                            /* onInvalid={validate} */ 
                        />
                        <InputGroup.Text className="!bg-input p-0 !border-1 !border-input">
                            <Button className="!rounded-[0_5px_5px_0] !text-primary border-0 !bg-input" 
                                type="submit"
                            >
                                {numberOfGuesses} / 5
                            </Button>
                        </InputGroup.Text>
                    </InputGroup>
                </Form>
                
                { dropdownVisible && (
                    <Dropdown className="!absolute left-1/2 -translate-x-1/2 z-[10000] w-full m-auto">

                    {/* Dropdown content */}
                    <div className="max-h-[10.1rem] overflow-auto bg-input border-1 border-input rounded"
                        ref={dropdownRef}
                    >
                        {filteredObcine?.map((obcina, index) => (
                            <Dropdown.Item className={`dropdown-option  p-1 
                                hover:!text-primary hover:!bg-neutral-700 
                                ${selectedIndex === index ? "!text-primary !bg-neutral-700" : "!text-secondary"}`}
                                key={index}
                                onMouseDown={handleDropdownClick}
                            >
                                {obcina}
                            </Dropdown.Item>
                        ))}
                    </div>
                </Dropdown>
                
                )}
            </div>
        </>
    )
}