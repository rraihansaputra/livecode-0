<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchProducts, searchProducts } from './_api';
	import type { Product } from './_api';
	import { debounce } from 'lodash';

	let productList: Product[] = [];

	onMount(async () => {
		// fetch the product list on mount
		const res = await fetchProducts();
		productList = res.body.data;
	});

	let searchTerm = '';
	let searchRes: Product[];
	let searchLoading;

	// debounce the input for search
	const handleInput = debounce((e) => {
		searchTerm = e.target.value;
	}, 300);

	// trigger search when searchTerm is changed
	$: handleSearch(searchTerm);

	async function handleSearch(trigger:string) {
		if (!searchTerm) {
			searchRes = undefined;
			return;
		}
		searchLoading = true;

		const res = await searchProducts(searchTerm);
		searchRes = res.body.data;

		searchLoading = false;
	}

	// logic to display either the productList or the searchRes
	// if there's a searchTerm and searchRes, show searchRes
	// else, show the original productList
	$: products = !!searchTerm && !!searchRes ? searchRes : productList;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="topbar">
	<input placeholder="Search by Name" on:input={handleInput} />
	<button>Cart</button>
</div>

{#if searchLoading}
	<p>Loading search..</p>
{/if}
<table class="main-table" style={searchLoading && 'opacity: 50%'}>
	<thead>
		<tr>
			<td>Name</td>
			<td>Price</td>
			<td />
		</tr>
	</thead>
	<tbody>
		{#each products as product (product._id)}
			<tr>
				<td>
					<a href="/product/{product._id}?foo=bar&baz&bizz=a&bizz=b">
						{product.product_name}
					</a>
				</td>
				<td>{product.product_price}</td>
				<td><button>Add</button></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.topbar {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2em;
	}

	table {
		border-collapse: collapse;
	}
	tr td {
		border-bottom: 1px solid black;
	}

	/* section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	} */
</style>
