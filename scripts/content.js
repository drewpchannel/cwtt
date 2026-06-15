console.log("Content script loaded on ITBoost/ConnectWise");

function runScan() {
    const cwButtons = document.getElementsByClassName('GMDB3DUBORG');

    for ( i in cwButtons ) { 
      if (cwButtons[i].innerText === "SEARCH") 
          { 
              cwButtons[i].click() 
          }   
    }

    const scroller = document.getElementById('srboard-listview-scroller');
    if (!scroller) return;

    // Use querySelectorAll to find tables inside the scroller safely
    const tables = scroller.querySelectorAll("table");
    if (tables.length === 0) return;

    const ticketNumbers = [];

    // Loop through every table found inside the scroller view
    tables.forEach((table) => {
        const tbodies = table.querySelectorAll("tbody");
        
        tbodies.forEach((tbody) => {
            const rows = tbody.querySelectorAll("tr");
            
            // Loop through EVERY row inside this specific tbody
            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');
                
                // Verify the row actually has table cells and index 1 exists
                if (cells && cells.length > 1) {
                    const ticketCell = cells[1]; // Grab the second column cell directly
                    const anchorElement = ticketCell.querySelector('div > a');
                    const spanElement = ticketCell.querySelector('div > span');
                    
                    let ticketId = "";
                    if (anchorElement) {
                        ticketId = anchorElement.innerText.trim();
                    } else if (spanElement) {
                        ticketId = spanElement.innerText.trim();
                    } else {
                        ticketId = ticketCell.innerText.trim();
                    }

                    // Clean out any blank strings or header text rows
                    if (ticketId && !isNaN(ticketId)) {
                        ticketNumbers.push(ticketId);
                    }
                }
            });
        });
    });

    // Debugging verification log: See the complete flat list of found numbers
    console.log("Scraped Ticket Numbers List:", ticketNumbers);

    // Send the full collection array to background.js
    if (ticketNumbers.length > 0) {
        try {
            chrome.runtime.sendMessage({ action: 'ticketsScraped', tickets: ticketNumbers });
        } catch (error) {
            console.log("Extension context sync error. Please refresh the page.");
        }
    }
}

// Run scan automatically every 20 seconds
setInterval(runScan, 25000);