import { InputProps, InputEvent, FormEvent, ClickEvent, KeyEvent } from "../../types/index";

import { Form, Dropdown, InputGroup, Button } from 'react-bootstrap';

import './input.css';
import { useState, useRef, useEffect } from "react";

// Custom validation texts
function validate() {   
    const input = document.getElementById("inputId") as HTMLInputElement;
    const value = input.value.trim();

    let isValidated = false;

    console.log(value);
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


export default function Input({ inputValue, setInputValue, handleGuess, numberOfGuesses, obcine }: InputProps) {  
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filteredObcine, setFilteredObcine] = useState<string[]>();
    
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
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Form.Control id="inputId" placeholder="Vpiši občino" type="text" maxLength={40} value={inputValue} autoComplete="off"
                                  onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown}  /* onInvalid={validate} */ /> 
                    
                    <InputGroup.Text className="bg-[dimgray] p-0 border border-black">
                        <Button className="!rounded-[0_5px_5px_0] text-black border-0 !bg-[dimgray] hover:bg-hover active:bg-active" type="submit">{numberOfGuesses} / 5</Button>
                    </InputGroup.Text>
                </InputGroup>
            </Form>
            
            {dropdownVisible && (
                <Dropdown className="dropdown-list max-h-[150px] w-[30vw] overflow-auto m-auto bg-[dimgray]" ref={dropdownRef} drop="up">
                    {filteredObcine?.map((obcina, index) => (
                        <Dropdown.Item className={`bg-[dimgray] text-zinc-500 !p-[3px] hover:!text-txt hover:!bg-neutral-600 
                            ${selectedIndex === index ? "!text-txt !bg-neutral-600" : ""}`} key={index} onMouseDown={handleDropdownClick}>{obcina}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            )}
        </>
    )
}