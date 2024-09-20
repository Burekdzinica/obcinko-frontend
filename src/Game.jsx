export default function Game() {
    const obcinaOfTheDay = "koper";

    function handleSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const obcinaGuess = event.target.elements.obcinaInput.value; // Get the input value
        console.log(obcinaGuess);

        if (obcinaGuess.toLowerCase() === obcinaOfTheDay.toLowerCase()) {
            console.log("Correct!");
        } else {
            console.log("Try again!");
        }

        event.target.reset(); // Clear the input field after submission
    }

    return (
        <div className="container">
            <h1 className="text-center" style={{ color: 'dimgrey' }}>Obcinko</h1>
            <form onSubmit={handleSubmit}>
                <input name="obcinaInput" className="form-control" placeholder="Vpiši občino" type="text" required />
                <button type="submit" className="btn btn-secondary col-lg-12 mt-2">Submit</button>
            </form>
        </div>
    );
}
