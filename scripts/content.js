console.log("Content script loaded on ITBoost");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data === 'scan') {
    	var ticketList = document.getElementById('srboard-listview-scroller').querySelectorAll("table")[0].querySelectorAll("tbody")[1].querySelectorAll("tr");
    	var ticketDataArray = [];

    	for (const ticket of ticketList) {
    	    if (ticket.querySelectorAll) {
    	        const ticketUnsortedArray = ticket.querySelectorAll('td');
    	        
    	        var rowData = [];
    	        
    	        for (const td of ticketUnsortedArray) {
    	            const anchorElement = td.querySelector('div > a');
    	            const spanElement = td.querySelector('div > span');
    	            
    	            if (anchorElement) {
    	                rowData.push(anchorElement.innerText.trim());
    	            } else if (spanElement) {
    	                rowData.push(spanElement.innerText.trim());
    	            } else {
    	                // Fallback: Grab raw text if there is no <a> or <span> so columns stay aligned
    	                rowData.push(td.innerText.trim());
    	            }
    	        }
    	        
    	        ticketDataArray.push(rowData);
    	    }
    	}
    	console.log(ticketDataArray);
        sendResponse({ success: true, tickets: ticketDataArray });
    }
    
    // Return true to keep channel open if doing async work inside here
    return true; 
});

setInterval(() => {
	var cwButtons = document.getElementsByClassName('GMDB3DUBORG');
    for ( i in cwButtons ) { 
    	if (cwButtons[i].innerText === "SEARCH") 
    		{ 
    			cwButtons[i].click() 
    		} 
    };
}, 120000);