let collegesData = [];
let previousRankings = [];

// Fetch the JSON data from file
fetch('filtered_data.json')
    .then(response => response.json())
    .then(data => {
        collegesData = data;
    })
    .catch(error => console.error('Error loading JSON:', error));

// Form submission handler
document.getElementById('rankingForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values from the form
    const tlr = parseFloat(document.getElementById('tlr').value) || 0;
    const rpc = parseFloat(document.getElementById('rpc').value) || 0;
    const go = parseFloat(document.getElementById('go').value) || 0;
    const oi = parseFloat(document.getElementById('oi').value) || 0;
    const pr = parseFloat(document.getElementById('pr').value) || 0;

    // Perform ranking calculation
    const rankedColleges = collegesData.map(college => {
        const weightedScore = (
            tlr * parseFloat(college['TLR']) + 
            rpc * parseFloat(college['RPC']) + 
            go * parseFloat(college['GO']) + 
            oi * parseFloat(college['OI']) + 
            pr * parseFloat(college['PR'])
        ) / 500;  // Normalize the score

        return {
            name: college['Institute Name'],
            city: college['City'],
            state: college['State'],
            score: weightedScore.toFixed(2),
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
