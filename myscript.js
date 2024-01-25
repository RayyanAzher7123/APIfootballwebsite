

/* Premier League Standings*/

document.addEventListener("DOMContentLoaded", function () {
    
    fetchLivePremierLeagueStandings();
    fetchFixturesAndResults();
    
});



function toggleFixtures() {
    const fixturesList = document.getElementById('fixtures-list');
    const toggleButton = document.getElementById('toggle-fixtures');
    const resultsList = document.getElementById('results-list');
    const toggleResultsButton = document.getElementById('toggle-results');

    // Hide results if currently visible
    resultsList.classList.remove('show-all');
    toggleResultsButton.textContent = 'Show All Results';

    if (fixturesList.classList.contains('show-all')) {
        // If already showing all fixtures, hide them
        fixturesList.classList.remove('show-all');
        toggleButton.textContent = 'Show All Fixtures';
    } else {
        // If not showing all fixtures, display them
        fixturesList.classList.add('show-all');
        toggleButton.textContent = 'Hide Fixtures';
    }
}

function toggleResults() {
    const resultsList = document.getElementById('results-list');
    const toggleButton = document.getElementById('toggle-results');
    const fixturesList = document.getElementById('fixtures-list');
    const toggleFixturesButton = document.getElementById('toggle-fixtures');

    // Hide fixtures if currently visible
    fixturesList.classList.remove('show-all');
    toggleFixturesButton.textContent = 'Show All Fixtures';

    if (resultsList.classList.contains('show-all')) {
        // If already showing all results, hide them
        resultsList.classList.remove('show-all');
        toggleButton.textContent = 'Show All Results';
    } else {
        // If not showing all results, display them
        resultsList.classList.add('show-all');
        toggleButton.textContent = 'Hide Results';
    }
}


async function fetchLivePremierLeagueStandings() {
    const url = 'https://heisenbug-premier-league-live-scores-v1.p.rapidapi.com/api/premierleague/table';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5912c7ec94msh81df0c851379252p18da0ejsn5d41669cbaa9',
            'X-RapidAPI-Host': 'heisenbug-premier-league-live-scores-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const standingsData = await response.json();
        displayLiveStandings(standingsData);
    } catch (error) {
        console.error(error);
    }
}
function displayLiveStandings(standingsData) {
    const standingsContainer = document.getElementById('live-standings-container');

    if (standingsData && standingsData.records) {
        const records = standingsData.records;

        standingsContainer.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('live-premier-league-table');

        const headers = ['Team', 'Played', 'Won', 'Draw', 'Lost', 'Goals For', 'Goals Against', 'Points'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        records.forEach(team => {
            // Check if the team is Everton and apply point deduction
            let totalPoints = team.points;
           

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${getTeamLogoUrl(team.team)}" alt="${team.team}" width="17">
                    ${team.team}
                </td>
                <td>${team.played}</td>
                <td>${team.win}</td>
                <td>${team.draw}</td>
                <td>${team.loss}</td>
                <td>${team.goalsFor}</td>
                <td>${team.goalsAgainst}</td>
                <td>${totalPoints}</td>
            `;
            table.appendChild(row);
        });

        standingsContainer.appendChild(table);
    } else {
        standingsContainer.innerHTML = '<p>Failed to fetch live Premier League standings.</p>';
    }
}



async function fetchFixturesAndResults() {
    const url = 'https://livescore-football.p.rapidapi.com/soccer/matches-by-league?country_code=england&league_code=premier-league';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5912c7ec94msh81df0c851379252p18da0ejsn5d41669cbaa9',
            'X-RapidAPI-Host': 'livescore-football.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const fixturesData = await response.json();
        displayFixturesAndResults(fixturesData);
    } catch (error) {
        console.error(error);
    }
}
// Function to get the URL for a team's logo
function getTeamLogoUrl(teamName) {
    
    return `images/${teamName.toLowerCase()}_logo.png`;
}


function displayFixturesAndResults(fixturesData) {
    const resultsContainer = document.getElementById('results-container');
    const fixturesContainer = document.getElementById('fixtures-container');

    if (fixturesData && fixturesData.data) {
        const fixtures = fixturesData.data;

        // Separate results and fixtures
        const results = fixtures.filter(fixture => fixture.status === 'FT');
        const upcomingFixtures = fixtures.filter(fixture => fixture.status !== 'FT');

        // Display the latest 10 results
        const latestResults = results.slice(-10).reverse();
        displayFixtureList(latestResults, 'results-list', resultsContainer);

        // Display the next 10 fixtures
        const nextFixtures = upcomingFixtures.slice(0, 10);
        displayFixtureList(nextFixtures, 'fixtures-list', fixturesContainer);

        // Add a button to toggle and view all fixtures
        const toggleButton1 = document.getElementById('toggle-fixtures');
        toggleButton1.addEventListener('click', toggleFixtures);

        const toggleButton2 = document.getElementById('toggle-results');
        toggleButton2.addEventListener('click', toggleResults);

    } else {
        resultsContainer.innerHTML = '<p>Failed to fetch Premier League fixtures.</p>';
        fixturesContainer.innerHTML = '<p>Failed to fetch Premier League fixtures.</p>';
    }
}
function displayFixtureList(fixtureList, listId, container) {
    const fixturesList = document.createElement('ul');
    fixturesList.classList.add('fixtures-list');
    fixturesList.id = listId;

    fixtureList.forEach(fixture => {
        const listItem = createFixtureListItem(fixture);
        fixturesList.appendChild(listItem);
    });

    container.appendChild(fixturesList);
}

function createLiveMatchListItem(match) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="live-match-info">
            <div class="team-info">
                <img src="${match.team_1.logo}" alt="${match.team_1.name}" class="team-logo">
                <span class="team-name">${match.team_1.name}</span>
            </div>
            <div class="score-info">
                ${match.score.full_time.team_1} - ${match.score.full_time.team_2}
            </div>
            <div class="team-info">
                <img src="${match.team_2.logo}" alt="${match.team_2.name}" class="team-logo">
                <span class="team-name">${match.team_2.name}</span>
            </div>
        </div>
        <div class="match-status">
            Status: ${match.status}
        </div>
    `;
    return listItem;
}
function formatDate(timestamp) {
    const year = Math.floor(timestamp / 10000000000);
    const month = Math.floor((timestamp % 10000000000) / 100000000);
    const day = Math.floor((timestamp % 100000000) / 1000000);
    const hour = Math.floor((timestamp % 1000000) / 10000);
    const minute = Math.floor((timestamp % 10000) / 100);
    
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    
    // Customize the options to display the date without seconds
    const options = { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    
    return date.toLocaleString('en-US', options);
}
function createFixtureListItem(fixture) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="fixture-info">
            <div class="team-info">
                <img src="${fixture.team_1.logo}" alt="${fixture.team_1.name}" class="team-logo">
                <span class="team-name">${fixture.team_1.name}</span>
            </div>
            <div class="score-info">
                ${fixture.score.full_time.team_1} - ${fixture.score.full_time.team_2}
            </div>
            <div class="team-info">
                <img src="${fixture.team_2.logo}" alt="${fixture.team_2.name}" class="team-logo">
                <span class="team-name">${fixture.team_2.name}</span>
            </div>
        </div>
        <div class="fixture-status">
            Status: ${fixture.status}
        </div>
        <div class="fixture-date">
        Date: ${formatDate(fixture.time.scheduled)}
        </div>
    `;
    return listItem;
}
