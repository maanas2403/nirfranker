let collegesData = [];
let previousRankings = [];

// Fetch the JSON data from file
fetch('data6.json')
    .then(response => response.json())
    .then(data => {
        collegesData = data;
    })
    .catch(error => console.error('Error loading JSON:', error));

// Toggle advanced inputs
function toggleAdvancedInputs(advancedInputDivId,basicId,buttonId) {
    const advancedInputDiv = document.getElementById(advancedInputDivId);
    const BasicDiv = document.getElementById(basicId);
    const button = document.getElementById(buttonId);
    if (advancedInputDiv.style.display === 'none') {
        BasicDiv.style.display='none';
        advancedInputDiv.style.display = 'flex';
        advancedInputDiv.style.flexDirection = 'column';
        advancedInputDiv.style.gap = '10px';
        button.textContent = 'Go Back to Basic Inputs';
    } else {
        advancedInputDiv.style.display = 'none';
        BasicDiv.style.display = 'flex';
        BasicDiv.style.flexDirection = 'column';
        BasicDiv.style.gap = '10px';
        button.textContent = 'Use Advanced Inputs';
    }
}

// Form submission handler
document.getElementById('rankingForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values from the form
    let tlr = 0, rpc = 0, go = 0, oi = 0, pr = 0;
    let ssWeight = 0, fsrWeight = 0, fqeWeight = 0, fruWeight = 0;
    let puWeight = 0, qpWeight = 0, iprWeight = 0, fpppWeight = 0;
    let gphWeight = 0, gueWeight = 0, msWeight = 0, gphdWeight = 0;
    let rdWeight = 0, wdWeight = 0, escsWeight = 0, pcsWeight = 0;

    // Determine if advanced inputs are being used
    const advancedTLRInputsVisible = document.getElementById('tlradvancedInputs').style.display === 'flex';
    const advancedRPCInputsVisible = document.getElementById('rpcadvancedInputs').style.display === 'flex';
    const advancedGOInputsVisible = document.getElementById('goadvancedInputs').style.display === 'flex';
    const advancedOIInputsVisible = document.getElementById('oiadvancedInputs').style.display === 'flex';

    // Get basic inputs
    if (!advancedTLRInputsVisible) {
        tlr = parseFloat(document.getElementById('tlr').value) || 0;
    }
    if (!advancedRPCInputsVisible) {
        rpc = parseFloat(document.getElementById('rpc').value) || 0;
    }
    if(!advancedGOInputsVisible){
    go = parseFloat(document.getElementById('go').value) || 0;
    }
    if(!advancedOIInputsVisible){
    oi = parseFloat(document.getElementById('oi').value) || 0;
    }
    pr = parseFloat(document.getElementById('pr').value) || 0;

    // Map over colleges and calculate scores
    const rankedColleges = collegesData.map(college => {
        let weightedScore = 0;
        let totalweight=0;
        if (advancedTLRInputsVisible) {
            ssWeight = parseFloat(document.getElementById('ss').value) || 0;
            fsrWeight = parseFloat(document.getElementById('fsr').value) || 0;
            fqeWeight = parseFloat(document.getElementById('fqe').value) || 0;
            fruWeight = parseFloat(document.getElementById('fru').value) || 0;

            weightedScore += (
                (ssWeight * parseFloat(college['SS'])*5) +
                (fsrWeight * parseFloat(college['FSR'])*(10/3)) +
                (fqeWeight * parseFloat(college['FQE'])*5) +
                (fruWeight * parseFloat(college['FRU'])*(10/3))
            );
            totalweight+=ssWeight+fsrWeight+fqeWeight+fruWeight;
        } else {
            weightedScore += tlr * parseFloat(college['TLR']);
            totalweight+=tlr;
        }

        if (advancedRPCInputsVisible) {
            puWeight = parseFloat(document.getElementById('pu').value) || 0;
            qpWeight = parseFloat(document.getElementById('qp').value) || 0;
            iprWeight = parseFloat(document.getElementById('ipr').value) || 0;
            fpppWeight = parseFloat(document.getElementById('fppp').value) || 0;

            weightedScore += (
                (puWeight * parseFloat(college['PU'])*(20/7)) +
                (qpWeight * parseFloat(college['QP'])*(5/2)) +
                (iprWeight * parseFloat(college['IPR'])*(20/3)) +
                (fpppWeight * parseFloat(college['FPPP'])*(10))
            );
            totalweight+=puWeight+qpWeight+iprWeight+fpppWeight;
        } else {
            weightedScore += rpc * parseFloat(college['RPC']);
            totalweight+=rpc;
        }

        if (advancedGOInputsVisible) {
            gphWeight = parseFloat(document.getElementById('gph').value) || 0;
            gueWeight = parseFloat(document.getElementById('gue').value) || 0;
            msWeight = parseFloat(document.getElementById('ms').value) || 0;
            gphdWeight = parseFloat(document.getElementById('gphd').value) || 0;

            weightedScore += (
                (gphWeight * parseFloat(college['GPH'])*(5/2)) +
                (gueWeight * parseFloat(college['GUE'])*(20/3)) +
                (msWeight * parseFloat(college['MS'])*(4)) +
                (gphdWeight * parseFloat(college['GPHD'])*(5))
            );
            totalweight+=gphWeight+gueWeight+msWeight+gphdWeight;
        } else {
            weightedScore += go * parseFloat(college['GO']);
            totalweight+=go;
        }

        if (advancedOIInputsVisible) {
            rdWeight = parseFloat(document.getElementById('rd').value) || 0;
            wdWeight = parseFloat(document.getElementById('wd').value) || 0;
            escsWeight = parseFloat(document.getElementById('escs').value) || 0;
            pcsWeight = parseFloat(document.getElementById('pcs').value) || 0;

            weightedScore += (
                (rdWeight * parseFloat(college['RD'])*(10/3)) +
                (wdWeight * parseFloat(college['WD'])*(10/3)) +
                (escsWeight * parseFloat(college['ESCS'])*(5)) +
                (pcsWeight * parseFloat(college['PCS'])*(5))
            );
            totalweight+=rdWeight+wdWeight+escsWeight+pcsWeight;
        } else {
            weightedScore += oi * parseFloat(college['OI']);
            totalweight+=oi;
        }

        // Finally add the PR score
        weightedScore += pr * parseFloat(college['PR']);
        totalweight+=pr;
        let ans=(weightedScore/totalweight);
        return {
            name: college['Institute Name'],
            city: college['City'],
            state: college['State'],
            score: ans.toFixed(2), // Keep score to 2 decimal points
            movement: "⏺ No change"
        };
    });

    // Sort by weighted score in descending order
    rankedColleges.sort((a, b) => b.score - a.score);

    // Compare with previous rankings if available
    if (previousRankings.length > 0) {
        rankedColleges.forEach((college, index) => {
            const prevRank = previousRankings.findIndex(c => c.name === college.name);
            if (prevRank === -1) {
                college.movement = "🆕 New Entry"; // New college in the list
            } else if (prevRank < index) {
                college.movement = `🔽 by ${index - prevRank}`; // College moved down by X positions
            } else if (prevRank > index) {
                college.movement = `🔼 by ${prevRank - index}`;   // College moved up by X positions
            } else {
                college.movement = "⏺ No change"; // College stayed in the same position
            }
        });
    }

    // Display ranked results with movement
    displayRankedColleges(rankedColleges);

    // Store the current rankings as previous rankings for next comparison
    previousRankings = rankedColleges;

    // Hide form and show results
    document.getElementById('rankingForm').style.display = 'none';
    document.getElementById('results').style.display = 'block';
});

// Function to display ranked colleges with movement indication
function displayRankedColleges(colleges) {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';  // Clear existing list

    colleges.forEach((college, index) => {
        const listItem = document.createElement('li');
        let movementText = "";

        // Add movement indicators (up by X, down by X, no change, new)
        movementText = college.movement;

        listItem.textContent = `${index + 1}. ${college.name} - ${college.city}, ${college.state} - Score: ${college.score} (${movementText})`;
        rankingList.appendChild(listItem);
    });
}

// Return button handler
document.getElementById('returnButton').addEventListener('click', function() {
    // Hide results and show form
    document.getElementById('results').style.display = 'none';
    document.getElementById('rankingForm').style.display = 'flex';
});

// Event listeners for toggling advanced inputs
document.getElementById('tlrtoggleAdvanced').addEventListener('click', function() {
    toggleAdvancedInputs('tlradvancedInputs','tlr','tlrtoggleAdvanced');
});

document.getElementById('rpctoggleAdvanced').addEventListener('click', function() {
    toggleAdvancedInputs('rpcadvancedInputs','rpc','rpctoggleAdvanced');
});

document.getElementById('gotoggleAdvanced').addEventListener('click', function() {
    toggleAdvancedInputs('goadvancedInputs','go','gotoggleAdvanced');
});

document.getElementById('oitoggleAdvanced').addEventListener('click', function() {
    toggleAdvancedInputs('oiadvancedInputs','oi','oitoggleAdvanced');
});
