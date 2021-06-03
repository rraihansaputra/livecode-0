<script lang="ts">
	import { getStores, navigating, page, session } from '$app/stores';
	import { onMount } from 'svelte';
	import { fetchProductDetail } from '../_api';
	import type { ProductDetail, Review } from '../_api';

	$: productId = $page.params.id;

	let product: ProductDetail;
	let localReviews: Review[] = [];

	onMount(async () => {
		// fetch the product details
		const res = await fetchProductDetail(productId);
		product = res.body.data;

		// get the local reviews
		// reviews are stored as an array under the productId key
		localReviews = JSON.parse(await window.localStorage.getItem(productId)) ?? [];
	});

	// combine the actual reviews with local reviews
	$: reviews = !!product ? [...product?.product_reviews, ...localReviews] : [...localReviews];

	// bind the form into reactive variables
	let reviewDetail = '';
	let reviewRating = 0;

	// check the validity of the form
	$: isFormValid = !!reviewDetail && !!reviewRating;

	async function handleReviewSubmit() {
		if (!isFormValid) {
			alert('Form is not complete');
			return;
		}

		// concatenate the new review into the localReviews
		const newReviews = [
			...localReviews,
			{ review_details: reviewDetail, review_rating: reviewRating }
		];

		// set the local storage
		await window.localStorage.setItem(productId, JSON.stringify(newReviews));

		// refresh the reactive variable
		localReviews = JSON.parse(await window.localStorage.getItem(productId)) ?? [];

		// reset the form
		reviewDetail = '';
		reviewRating = 0;
	}
</script>

<button on:click={() => window.history.back()}> Back </button>

{#if product}
	<div>
		<p><b>Name: </b>{product.product_name}</p>
		<p><b>Price: </b>{product.product_price}</p>
		<p><b>Description: </b>{product.product_description}</p>

		<table>
			<thead>
				<tr>
					<td>Comments</td>
					<td>Rating</td>
				</tr>
			</thead>
			<tbody>
				{#each reviews as review}
					<tr>
						<td>{review.review_details}</td>
						<td>{review.review_rating} / 5</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<hr />
	<p><b>Add your own review!</b></p>

	<form on:submit|preventDefault={handleReviewSubmit}>
		<label for="review_details">Comment</label>
		<input id="review_details" type="text" bind:value={reviewDetail} /><br />

		<label for="review_rating">Rating (out of 5)</label>
		<select id="review-rating" bind:value={reviewRating}>
			<option selected disabled value="0">None</option>
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
			<option value="5">5</option>
		</select>
		<br />

		<button type="submit">Submit</button>
	</form>
{:else}
	<p>Loading product..</p>
{/if}

<style>
	table {
		border-collapse: collapse;
	}
	tr td {
		border-bottom: 1px solid black;
	}
</style>
