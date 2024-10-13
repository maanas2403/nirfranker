
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
function validateInput(id) {
    const input = document.getElementById(id);
    const value = parseFloat(input.value);
    if (value < 0 || value > 100) {
        input.style.border = '2px solid red'; // Highlight the error
        return false;
    } else {
        input.style.border = ''; // Remove the error highlight
        return true;
    }
}
document.getElementById('rankingForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let valid = true;

    // Validate inputs for TLR, RPC, etc.
    valid = validateInput('tlr') && validateInput('rpc') && validateInput('go') && validateInput('oi') && validateInput('pr');
    
    if (!valid) {
        alert('Please fill out all inputs correctly.');
        return; // Stop submission
    }
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
            tlr: college['TLR'],
            rpc: college['RPC'],
            go: college['GO'],
            oi: college['OI'],
            pr: college['PR'],
            ss: (college['SS']*5).toFixed(2),
            fsr: (college['FSR']*(10/3)).toFixed(2),
            fqe: (college['FQE']*5).toFixed(2),
            fru: (college['FRU']*(10/3)).toFixed(2),
            pu: (college['PU']*(20/7)).toFixed(2),
            qp: (college['QP']*(5/2)).toFixed(2),
            ipr: (college['IPR']*(20/3)).toFixed(2),
            fppp: (college['FPPP']*(10)).toFixed(2),
            gph: (college['GPH']*(5/2)).toFixed(2),
            gue: (college['GUE']*(20/3)).toFixed(2),
            ms: (college['MS']*4).toFixed(2),
            gphd: (college['GPHD']*5).toFixed(2),
            rd: (college['RD']*(10/3)).toFixed(2),
            wd: (college['WD']*(10/3)).toFixed(2),
            escs: (college['ESCS']*5).toFixed(2),
            pcs: (college['PCS']*5).toFixed(2),
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
    function displayCollegeDetails(college) {
        const modal = document.getElementById('collegeDetailsModal');
        const collegeName = document.getElementById('collegeName');
        const collegeDetails = document.getElementById('collegeDetails');
        const button = document.getElementById('closeModalButton');
        // Set the name and details of the college
        collegeName.textContent = college.name;
        collegeDetails.innerHTML = `
            <strong>City:</strong> ${college.city}<br>
            <strong>State:</strong> ${college.state}<br>
            <strong>Score:</strong> ${college.score}<br><br>
            <strong>TLR:</strong> ${college.tlr}<br>
            <strong>SS:</strong> ${college.ss}<br>
            <strong>FSR:</strong> ${college.fsr}<br>
            <strong>FQE:</strong> ${college.fqe}<br>
            <strong>FRU:</strong> ${college.fru}<br><br>
            <strong>RPC:</strong> ${college.rpc}<br>
            <strong>PU:</strong> ${college.pu}<br>
            <strong>QP:</strong> ${college.qp}<br>
            <strong>IPR:</strong> ${college.ipr}<br>
            <strong>FPPP:</strong> ${college.fppp}<br><br>
            <strong>GO:</strong> ${college.go}<br>
            <strong>GPH:</strong> ${college.gph}<br>
            <strong>GUE:</strong> ${college.gue}<br>
            <strong>MS:</strong> ${college.ms}<br>
            <strong>GPHD:</strong> ${college.gphd}<br><br>
            <strong>OI:</strong> ${college.oi}<br>
            <strong>RD:</strong> ${college.rd}<br>
            <strong>WD:</strong> ${college.wd}<br>
            <strong>ESCS:</strong> ${college.escs}<br>
            <strong>PCS:</strong> ${college.pcs}<br><br>
            <strong>PR:</strong> ${college.pr}
        `;
    
        // Display the modal
        modal.style.display = 'block';
        button.style.display = 'block';
        // Call function to plot the chart
        plotCollegeGraph(college);
        plotTLRBreakdown(college);
        plotRPCBreakdown(college);
        plotGOBreakdown(college);
        plotOIBreakdown(college);
    }
    
    // Define a universal set of distinct colors for all charts
    const universalColors = {
        backgroundColors: [
            // First five colors
            '#ff0000', '#0000ff', '#008000', '#ffff00', '#808080',  // Red, Blue, Green, Yellow, Grey
            // Shades of Red
            '#ff6666', '#ff4d4d', '#e60000', '#cc0000',  // Lighter to Darker Reds
            // Shades of Blue
            '#66b3ff', '#3399ff', '#0073e6', '#0059b3',  // Lighter to Darker Blues
            // Shades of Green
            '#66ff66', '#33cc33', '#009900', '#006600',  // Lighter to Darker Greens
            // Shades of Yellow
            '#ffff66', '#ffcc00', '#ffb84d', '#e6ac00',  // Lighter to Darker Yellows
            // Shades of Grey
            '#bfbfbf', '#a6a6a6', '#8c8c8c', '#737373'   // Lighter to Darker Greys
        ],
        borderColors: [
            // Corresponding border colors
            '#cc0000', '#0000cc', '#006400', '#cccc00', '#666666',  // Darker borders for Red, Blue, Green, Yellow, Grey
            '#cc3333', '#cc0000', '#b30000', '#990000',  // Darker borders for shades of Red
            '#3385ff', '#2673cc', '#0059b3', '#003d99',  // Darker borders for shades of Blue
            '#33cc33', '#008000', '#006400', '#004d00',  // Darker borders for shades of Green
            '#cccc33', '#e6b800', '#d9a300', '#b38f00',  // Darker borders for shades of Yellow
            '#999999', '#808080', '#666666', '#4d4d4d'   // Darker borders for shades of Grey
        ]
    };
    

    function plotCollegeGraph(college) {
        const ctx = document.getElementById('collegeChart').getContext('2d');
        if (window.collegeChartInstance) {
            window.collegeChartInstance.destroy(); // Destroy previous instance if it exists
        }
        window.collegeChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['TLR', 'RPC', 'GO', 'OI', 'PR'],
                datasets: [{
                    label: 'Score',
                    data: [college.tlr, college.rpc, college.go, college.oi, college.pr],
                    backgroundColor: universalColors.backgroundColors.slice(0, 5),
                    borderColor: universalColors.borderColors.slice(0, 5),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function plotRPCBreakdown(college) {
        const ctx2 = document.getElementById('rpcbreakdownChart').getContext('2d');
        if (window.breakdownChartInstance2) {
            window.breakdownChartInstance2.destroy(); // Destroy previous instance
        }
        document.getElementById('rpcbreakdownChart').style.display = 'block';
        window.breakdownChartInstance2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['PU', 'QP', 'IPR', 'FPPP'],
                datasets: [{
                    label: 'RPC Breakdown',
                    data: [college.pu, college.qp, college.ipr, college.fppp],
                    backgroundColor: universalColors.backgroundColors.slice(9, 13),
                    borderColor: universalColors.borderColors.slice(9, 13),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function plotTLRBreakdown(college) {
        const ctx = document.getElementById('tprbreakdownChart').getContext('2d');
        if (window.breakdownChartInstance) {
            window.breakdownChartInstance.destroy(); // Destroy previous instance
        }
        document.getElementById('tprbreakdownChart').style.display = 'block';
        window.breakdownChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['SS', 'FSR', 'FQE', 'FRU'],
                datasets: [{
                    label: 'TLR Breakdown',
                    data: [college.ss, college.fsr, college.fqe, college.fru],
                    backgroundColor: universalColors.backgroundColors.slice(5, 9),
                    borderColor: universalColors.borderColors.slice(5, 9),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function plotGOBreakdown(college) {
        const ctx4 = document.getElementById('gobreakdownChart').getContext('2d');
        if (window.breakdownChartInstance4) {
            window.breakdownChartInstance4.destroy(); // Destroy previous instance
        }
        document.getElementById('gobreakdownChart').style.display = 'block';
        window.breakdownChartInstance4 = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: ['GPH', 'GUE', 'MS', 'GPHD'],
                datasets: [{
                    label: 'GO Breakdown',
                    data: [college.gph, college.gue, college.ms, college.gphd],
                    backgroundColor: universalColors.backgroundColors.slice(13, 17),
                    borderColor: universalColors.borderColors.slice(13, 17),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function plotOIBreakdown(college) {
        const ctx3 = document.getElementById('oibreakdownChart').getContext('2d');
        if (window.breakdownChartInstance5) {
            window.breakdownChartInstance5.destroy(); // Destroy previous instance
        }
        document.getElementById('oibreakdownChart').style.display = 'block';
        window.breakdownChartInstance5 = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['RD', 'WD', 'ESCS', 'PCS'],
                datasets: [{
                    label: 'OI Breakdown',
                    data: [college.rd, college.wd, college.escs, college.pcs],
                    backgroundColor: universalColors.backgroundColors.slice(17, 21),
                    borderColor: universalColors.borderColors.slice(17, 21),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    

    document.getElementById('closeModalButton').addEventListener('click', function() {
        document.getElementById('collegeDetailsModal').style.display = 'none';
        // Optionally destroy the chart instances here if necessary
        if (window.collegeChartInstance) {
            window.collegeChartInstance.destroy();
        }
        if (window.breakdownChartInstance) {
            window.breakdownChartInstance.destroy();
        }
        if (window.rpcbreakdownChartInstance) {
            window.rpcbreakdownChartInstance.destroy();
        }
    });
    document.getElementById('rankingList').addEventListener('click', function (event) {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'LI') {
            const collegeIndex = clickedElement.dataset.index; // Get the index of the college from the dataset
            const college = rankedColleges[collegeIndex]; // Find the college using the index
            displayCollegeDetails(college);
        }
    });
    
    document.getElementById('closeModalButton').addEventListener('click', function() {
        document.getElementById('collegeDetailsModal').style.display = 'none';
    });
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
        listItem.setAttribute('data-index', index);
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


