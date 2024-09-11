// Function to delete the active thread
function deleteActiveThread() {
    // Look for the active thread based on the provided class
    const activeThread = document.querySelector('.bg-token-sidebar-surface-secondary');

    if (activeThread) {
        console.log("Active thread found!");

        // Step 1: Find the ellipsis button to open the options menu
        const ellipsisButton = activeThread.querySelector('button[aria-haspopup="menu"]');

        if (ellipsisButton) {
            console.log("Ellipsis button found! Focusing and simulating spacebar press...");

            // Focus the button first
            ellipsisButton.focus();

            // Step 2: Simulate the spacebar key press to trigger the ellipsis menu
            const spacebarEvent = new KeyboardEvent('keydown', {
                key: ' ',
                code: 'Space',
                keyCode: 32, // Spacebar keycode
                which: 32,
                bubbles: true,
                cancelable: true
            });

            setTimeout(() => {
                ellipsisButton.dispatchEvent(spacebarEvent); // Simulate the spacebar press
                console.log("Spacebar press simulated!");

                // Step 3: Use MutationObserver to detect any changes in the DOM (e.g., the menu appearing)
                const observer = new MutationObserver((mutationsList, observer) => {
                    for (let mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            console.log('DOM mutation detected. Checking for the delete option...');

                            // Try to find the "Delete" option after the menu appears
                            const deleteOption = Array.from(document.querySelectorAll('div, span, button')).find(
                                el => el.textContent.trim() === 'Delete'
                            );

                            if (deleteOption) {
                                console.log("Delete option found! Clicking it...");
                                deleteOption.click(); // Click on the "Delete" option

                                // Step 4: Wait for the confirmation dialog, then confirm deletion
                                setTimeout(() => {
                                    const confirmDeleteButton = Array.from(document.querySelectorAll('div, button')).find(
                                        el => el.textContent.trim() === 'Delete'
                                    );

                                    if (confirmDeleteButton) {
                                        console.log("Delete confirmation button found! Clicking it...");
                                        confirmDeleteButton.click(); // Confirm the deletion

                                        // After deletion, move to the next thread
                                        setTimeout(() => openNextThread(), 500);
                                    } else {
                                        console.error('Delete confirmation button not found.');
                                    }
                                }, 500); // Wait for the confirmation dialog to appear

                                observer.disconnect(); // Stop observing once the delete option is found
                                return;
                            }
                        }
                    }
                });

                // Start observing changes in the document body (e.g., menu being added)
                observer.observe(document.body, { childList: true, subtree: true });

            }, 100); // Small delay before dispatching the key press event

        } else {
            console.error('Ellipsis button not found in the active thread.');
        }
    } else {
        console.error('No active thread found.');
    }
}

// Function to open the next thread
function openNextThread() {
    // Assuming there's a list of threads and the active one can be identified
    const allThreads = document.querySelectorAll('.no-draggable'); // Adjusted to select all threads by their container class

    if (allThreads.length > 0) {
        // Find the index of the active thread
        let activeIndex = Array.from(allThreads).findIndex(thread => thread.classList.contains('bg-token-sidebar-surface-secondary'));

        // Open the next thread in line
        if (activeIndex >= 0 && activeIndex < allThreads.length - 1) {
            const nextThread = allThreads[activeIndex + 1].querySelector('a');
            if (nextThread) {
                console.log("Opening next thread...");
                nextThread.click(); // Open the next thread
            }
        } else if (activeIndex === allThreads.length - 1) {
            console.log('No more threads to open.');
        } else {
            console.error('Active thread not found in the list.');
        }
    } else {
        console.error('No threads found.');
    }
}

// Function to add a listener for the keyboard shortcut (Ctrl + G)
function addShortcutListener() {
    document.addEventListener('keydown', function(event) {
        // Checking for "Ctrl + G" as the keyboard shortcut
        if (event.ctrlKey && event.key === 'g') {
            event.preventDefault(); // Prevent default behavior
            console.log("Ctrl + G pressed!");
            deleteActiveThread(); // Delete the active thread and open the next one
        }
    });
}

// Initialize the shortcut listener when the script runs
addShortcutListener();
