console.log('Background Service Worker loaded with flood protection');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ticketsScraped') {
        trackTicketsDirectly(message.tickets);
        console.log(message.tickets);
    }
});

function trackTicketsDirectly(incomingTicketNumbers) {
  if (!incomingTicketNumbers || incomingTicketNumbers.length === 0) return;

  chrome.storage.local.get({ savedTicketsArray: [] }, (result) => {
    let savedTickets = result.savedTicketsArray;
    let changeDetected = false;

    // FLOOD PROTECTION: If savedTickets is completely empty, this is the very first scan.
    // We populate the baseline storage without sending any emails.
    if (savedTickets.length === 0) {
        console.log("🚀 Initial baseline setup: Saving current tickets silently. No emails sent.");
        chrome.storage.local.set({ savedTicketsArray: incomingTicketNumbers }, () => {
            console.log(`💾 Baseline established with ${incomingTicketNumbers.length} tickets.`);
        });
        return; // Exit early so no emails are triggered [1]
    }

    // Standard loop for all future scans
    incomingTicketNumbers.forEach(ticketNum => {
      if (!savedTickets.includes(ticketNum)) {
        console.log(`✨ New Ticket Number Detected: ${ticketNum}`);
        savedTickets.push(ticketNum);
        changeDetected = true;
        sendEmail(ticketNum); // This only fires for tickets arriving AFTER the baseline
      }
    });

    if (changeDetected) {
      chrome.storage.local.set({ savedTicketsArray: savedTickets });
    }
  });
}

function sendEmail(ticketNumber) {
    // Correct URL endpoint for the REST API
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            service_id: 'service_78b99y7',
            template_id: 'template_rfooptc',
            user_id: 'Q1xgtsKd3uTd_X0jB',
            template_params: {
                number: ticketNumber
            }
        })
    })
    .then(async (response) => {
        // Explicitly check for API success codes (200-299)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorText}`);
        }
        console.log(`📧 Email sent successfully for ticket #${ticketNumber}`);
    })
    .catch(err => {
        // True server configuration errors will now land here
        console.error("❌ EmailJS API Delivery Failure:", err.message);
    });
}