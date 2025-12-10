// Fetch the current counter value from the API and update the UI
async function fetchCounter() {
	const counterEl = document.querySelector('.counter-value');
	if (!counterEl) return;

	counterEl.textContent = '...';
	counterEl.classList.add('loading');

	try {
		const res = await fetch('https://anya-api.bongibau.lt/counter');
		if (!res.ok) throw new Error('API counter failed');
		const data = await res.json();
		counterEl.textContent = data.counter ?? '0';
	} catch (err) {
		console.error('Unable to load counter', err);
		counterEl.textContent = '—';
	}

	counterEl.classList.remove('loading');
}

// Increment the counter via API, then refresh the UI
async function incrementCounter() {
	const counterEl = document.querySelector('.counter-value');
	if (!counterEl) return;

	try {
		const res = await fetch('https://anya-api.bongibau.lt/counter/increment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		if (!res.ok) throw new Error('API increment failed');
		const data = await res.json();
		counterEl.textContent = data.counter ?? counterEl.textContent;
		counterEl.classList.remove('bump');
		// force reflow to replay animation
		void counterEl.offsetWidth;
		counterEl.classList.add('bump');
	} catch (err) {
		console.error('Unable to increment counter', err);
	}
}

// Wire buttons to increment the counter
function bindCounterButtons() {
	const buttons = document.querySelectorAll('[data-increment="counter"]');
	buttons.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			incrementCounter();
		});

        // if data-href is set, open that link in a new tab
        const href = btn.getAttribute('data-href');
        if (href) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(href, '_blank');
            });
        }
	});
}

document.addEventListener('DOMContentLoaded', () => {
	bindCounterButtons();
	fetchCounter();

	setInterval(fetchCounter, 2000);
});
