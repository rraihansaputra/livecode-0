import type { Request } from '@sveltejs/kit';

/*
	This module is used by the /todos.json and /todos/[uid].json
	endpoints to make calls to api.svelte.dev, which stores todos
	for each user. The leading underscore indicates that this is
	a private module, _not_ an endpoint — visiting /todos/_api
	will net you a 404 response.

	(The data on the todo app will expire periodically; no
	guarantees are made. Don't use it to organise your life.)
*/

const base = 'https://dummyproducts-api.herokuapp.com/api/v1';

async function api(
	method: string,
	resource: string,
	data?: Record<string, any>
): Promise<{ status: number; body: Record<string, any> }> {
	const res = await fetch(`${base}/${resource}`, {
		method: method,
		headers: {
			'content-type': 'application/json'
		},
		body: data && JSON.stringify(data)
	});

	// // if the request came from a <form> submission, the browser's default
	// // behaviour is to show the URL corresponding to the form's "action"
	// // attribute. in those cases, we want to redirect them back to the
	// // /todos page, rather than showing the response
	// if (res.ok && request.method !== 'GET' && request.headers.accept !== 'application/json') {
	// 	return {
	// 		status: 303,
	// 		headers: {
	// 			location: '/todos'
	// 		}
	// 	};
	// }

	return {
		status: res.status,
		body: await res.json()
	};
}


export interface Product {
    _id: string;
    product_image_sm: string;
    product_image_md: string;
    product_image_lg: string;
    product_name: string;
    product_type: string;
    product_department: string;
    product_departmentId: string;
    product_color: string;
    product_material: string;
    product_stock: number;
    product_price: number;
    product_ratings: number;
    product_sales: number;
}

export async function fetchProducts(): Promise<{status: number, body: any}> {
    return api("GET", "/products?apikey=5oIDTjlULgO8")
}
export async function searchProducts(term: string): Promise<{status: number, body: any}> {
    return api("GET", `/products/search?term=${term}&apikey=5oIDTjlULgO8`)
}

export interface Review {
    _id: string;
    __v: number
    review_productid: string;
    review_name: string;
    review_avatar: string;
    review_details: string;
    review_rating: number;
}

export interface ProductDetail {
    product_image_sm: string;
    product_image_md: string;
    product_image_lg: string;
    product_reviews: Review[];
    product_name: string;
    product_type: string;
    product_department: string;
    product_departmentId: string;
    product_color: string;
    product_material: string;
    product_stock: number;
    product_price: number;
    product_ratings: number;
    product_sales: number;
    product_description: string;
}

export async function fetchProductDetail(productId: string): Promise<{status: number, body: any}> {
    return api("GET", `/products/${productId}?apikey=5oIDTjlULgO8`)
}
