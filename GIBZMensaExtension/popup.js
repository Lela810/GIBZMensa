function setupCounter(initialValue = 0) {


    chrome.storage.local.set({ newCount: 10 })
    document.getElementById('counter').innerHTML = counterStorage.get('newCount');

    // document.getElementById('incrementBtn').addEventListener('click', () => {
    //    updateCounter({
    //        type: 'INCREMENT',
    //   });
    //}); 
}


function updateCounter({ type }) {
    counterStorage.get(count => {
        let newCount;

        if (type === 'INCREMENT') {
            newCount = count + 1;
        } else if (type === 'DECREMENT') {
            newCount = count - 1;
        } else {
            newCount = count;
        }

        counterStorage.set(newCount, () => {
            document.getElementById('counter').innerHTML = newCount;

            // Communicate with content script of
            // active tab by sending a message
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                const tab = tabs[0];

                chrome.tabs.sendMessage(
                    tab.id, {
                        type: 'COUNT',
                        payload: {
                            count: newCount,
                        },
                    },
                    response => {
                        console.log('Current count value passed to contentScript file');
                    }
                );
            });
        });
    });
}

function restoreCounter() {
    // Restore count value
    counterStorage.get(count => {
        if (typeof count === 'undefined') {
            // Set counter value as 0
            counterStorage.set(0, () => {
                setupCounter(0);
            });
        } else {
            setupCounter(count);
        }
    });
}

document.addEventListener('DOMContentLoaded', setupPage);