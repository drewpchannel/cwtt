console.log('Background Service Worker loaded');

// Audio cannot be played directly inside a background service worker anymore.
// We use a silent offscreen document or pass it back to the active tab to play it.
function playAlertSound() {
  const soundUrl = "https://github.com/drewpchannel/cwtt/raw/refs/heads/main/alert.mp3";
  // Background workers don't support "new Audio()". 
  // To avoid errors, we log it here. You can implement an offscreen document if sound is mandatory.
  console.log("Ticket trigger event occurred (Sound would play here).");
}

function trackTicketsDirectly(newTicketArrays) {
  if (!newTicketArrays || newTicketArrays.length === 0) return;

  chrome.storage.local.get({ savedTicketsArray: [] }, (result) => {
    let savedTickets = result.savedTicketsArray;
    let changeDetected = false;

    newTicketArrays.forEach(newTicket => {
      const newId = newTicket[1]; // Using Index 1 as Ticket ID
      if (!newId) return;

      const existingTicketIndex = savedTickets.findIndex(savedTicket => savedTicket[1] === newId);

      if (existingTicketIndex === -1) {
        console.log(`New Ticket Added: ${newId}`);
        savedTickets.push(newTicket);
        changeDetected = true;
        //playAlertSound();
        sendEmail(newTicket);
      } else {
        const savedTicket = savedTickets[existingTicketIndex];
        
        // Compare Status (Index 4) and Last Updated (Index 12)
        const statusChanged = savedTicket[4] !== newTicket[4];
        const timeChanged = savedTicket[12] !== newTicket[12];

        if (statusChanged || timeChanged) {
          console.log(`Change on Ticket ${newId}!`);
          savedTickets[existingTicketIndex] = newTicket;
          changeDetected = true;
          // Optional: Send another email if status changes
          sendEmail(newTicket); 
        }
      }
    });

    if (changeDetected) {
      chrome.storage.local.set({ savedTicketsArray: savedTickets }, () => {
        console.log("Storage updated with changes.");
      });
    }
  });
}

function sendEmail(ticket) {
  console.log('sending email for ticket:', ticket[1]);
  
  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_id: 'service_78b99y7',
      template_id: 'template_rfooptc',
      user_id: 'Q1xgtsKd3uTd_X0jB',
      template_params: {
        number: ticket[1],
        updated: ticket[12]
      }
    })
  })
  .then(res => console.log("Email sent successfully"))
  .catch(err => console.error("Email error:", err));
}

// Listen for the scraped ticket data coming from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ticketsScraped') {
        trackTicketsDirectly(message.tickets);
    }
});