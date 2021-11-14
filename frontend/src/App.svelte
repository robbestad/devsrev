<script>
	import axios from "axios"
	import {onMount} from "svelte";
	let remaining = 0;
	let taken = [];
	let availableIds = [];

	function fetchMeta() {
		axios.get("./meta.json")
			.then(({data}) => {
				remaining = data.remaining;
			})
	}

	function fetchTaken() {
		axios.get("./taken.json")
			.then(({data}) => {
				taken = data.taken;
				let ids = [];
				for (let i = 1; i < 7778; i++) ids.push(i);
				availableIds = ids.filter((id => !taken.includes(id)));
			});
	}

	onMount(async () => {
		fetchMeta();
		fetchTaken();
	});
</script>

<span>
    <p>Token Ids can be any number between 1 and 7778.</p>
    <p>
     That's it, folks. All are taken. 
    <div>
        <h2>Stats</h2>
        <p>
            <strong>Remaining tokens:</strong> {remaining}
        </p>
        <p>
            <strong>Tokens taken:</strong> {taken.length}
        </p>

    </div>
    <div>
        <h2>100 first available tokens</h2>
        <p>
             That's it, folks. All are taken. 
        </p>
    </div>
    <div>
    <a href="https://opensea.io/collection/devs-for-revolution" target="_blank" referrer="no-referrer no-opener">Open OpenSea to buy second-hand (in a new window)</a>
    </div>

    <div>
    <a href="https://etherscan.io/token/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b#writeContract" target="_blank" referrer="no-referrer no-opener">Open Etherscan (in a new window)</a>
    </div>
</span>
