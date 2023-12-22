const web3 = new Web3("https://rpc.sepolia.io");
const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const abi = [
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "Name",
                    "type": "string"
                }
            ],
            "name": "register_candidate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "Name",
                    "type": "string"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "get_candidates",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "results",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
]; // Replace with your actual contract ABI

// let web3;
let contractInstance;

async function init() {
    // Check if Web3 is injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.error('Web3 not detected. Please install MetaMask or another Web3 provider.');
        return;
    }

    // Use the current Ethereum provider and create a contract instance
    contractInstance = new web3.eth.Contract(abi, contractAddress);
}

async function registerCandidate() {
    const candidateName = $('#candidateName').val();
    try {
        await contractInstance.methods.register_candidate(candidateName).send({ from: 'YOUR_ACCOUNT_ADDRESS' });
        alert(`Candidate ${candidateName} registered successfully.`);
    } catch (error) {
        console.error(error);
        alert('Error registering candidate. Please check the console for details.');
    }
}

async function vote() {
    const candidateName = $('#voteFor').val();
    try {
        await contractInstance.methods.vote(candidateName).send({ from: 'YOUR_ACCOUNT_ADDRESS' });
        alert(`Vote for ${candidateName} submitted successfully.`);
    } catch (error) {
        console.error(error);
        alert('Error submitting vote. Please check the console for details.');
    }
}

async function getCandidates() {
    try {
        const candidates = await contractInstance.methods.get_candidates().call();
        populateCandidatesDropdown(candidates);
    } catch (error) {
        console.error(error);
        alert('Error getting candidates. Please check the console for details.');
    }
}

function populateCandidatesDropdown(candidates) {
    const dropdown = $('#voteFor');
    dropdown.empty();
    candidates.forEach(candidate => {
        dropdown.append($('<option></option>').attr('value', candidate).text(candidate));
    });
}

async function getResults() {
    try {
        const result = await contractInstance.methods.results().call();
        displayResults(result);
    } catch (error) {
        console.error(error);
        alert('Error getting results. Please check the console for details.');
    }
}

function displayResults(result) {
    const resultDisplay = $('#resultDisplay');
    resultDisplay.text(`${result[0]} ${result[1]} ${result[2]} ${result[3]}`);
}

$(document).ready(async function () {
    await init();
});
