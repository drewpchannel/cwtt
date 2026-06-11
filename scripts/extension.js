console.log('ext load');

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('gettickets');
    
    button.addEventListener('click', async () => {
        try {
            // Use modern async/await instead of callbacks
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tabs || tabs.length === 0) {
                console.error("No active tab found.");
                return;
            }

            // Send message and await the response directly
            const response = await chrome.tabs.sendMessage(
                tabs[0].id, 
                { data: 'scan' },
                { frameId: 0 }
            );
            console.log(response.tickets);
            trackTicketsDirectly(response.tickets);

        } catch (error) {
            // Catches cases where the content script hasn't loaded or page is wrong
            console.error("Messaging failed:", error.message);
        }
    });
});

function trackTicketsDirectly(newTicketArrays) {
  // 1. Pull the existing array of arrays from storage (default to empty array if none exist)
  chrome.storage.local.get({ savedTicketsArray: [] }, (result) => {
    let savedTickets = result.savedTicketsArray;
    let changeDetected = false;

    newTicketArrays.forEach(newTicket => {
      const newId = newTicket[1];
      if (!newId) return; // Skip invalid data

      // 2. Find if this ticket ID already exists in our saved storage array
      const existingTicketIndex = savedTickets.findIndex(savedTicket => savedTicket[1] === newId);

      if (existingTicketIndex === -1) {
        // Ticket is brand new. Add it to our storage list.
        console.log(`✨ New Ticket Added: ${newId}`);
        savedTickets.push(newTicket);
        changeDetected = true;
        playAlertSound();
      } else {
        // Ticket exists. Compare indices 4 (Status) and 12 (Last Updated)
        const savedTicket = savedTickets[existingTicketIndex];
        
        const statusChanged = savedTicket[4] !== newTicket[4];
        const timeChanged = savedTicket[12] !== newTicket[12];

        if (statusChanged || timeChanged) {
          console.log(`⚠️ Change on Ticket ${newId}!`);
          
          // Replace the old array with the updated array directly
          savedTickets[existingTicketIndex] = newTicket;
          changeDetected = true;
        }
      }
    });

    // 3. Save the native JavaScript array straight back to Chrome storage
    if (changeDetected) {
      chrome.storage.local.set({ savedTicketsArray: savedTickets }, () => {
        console.log("💾 Storage updated with changes.");
      });
    } else {
      console.log("✅ Everything matches. No storage updates needed.");
    }
  });
}

function playAlertSound() {
  const soundUrl = "https://github.com/drewpchannel/cwtt/raw/refs/heads/main/alert.mp3";
  const audio = new Audio(soundUrl);
  
  audio.play()
    .then(() => console.log("🔊 Alert sound played successfully."))
    .catch(error => {
      console.warn("🔊 Audio blocked or failed:", error.message);
      console.log("Tip: Chrome requires you to click inside the extension popup once before it allows audio to play.");
    });
}