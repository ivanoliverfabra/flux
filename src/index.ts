import Types, { FluxI, FluxNames, FluxOptions, FluxTransactions, FluxWallets, PaginationProps } from "./types";
export { Types };

export default class Flux implements FluxI {
	public API_URL = "https://api.fabra.live";
	public API_VERSION = "v1";

	constructor(options?: FluxOptions) {
		if (options?.apiUrl) this.API_URL = options.apiUrl;
		if (options?.apiVersion) this.API_VERSION = options.apiVersion;
	}

	public wallets: FluxWallets = {
		get: async (pagination) => this.get("wallets", pagination),
		create: async () => this.post("wallets"),
		rich: async (pagination) => this.get("wallets/rich", pagination),
		getByAddress: async (address) => this.get(`wallets/${address}`),
		getTransactions: async (address, pagination) => this.get(`wallets/${address}/transactions`, pagination),
		getNames: async (address) => this.get(`wallets/${address}/names`),
	};

	public transactions: FluxTransactions = {
		get: async (pagination) => this.get("transactions", pagination),
		create: async (privateKey, to, amount, metadata) =>
			this.post("transactions", { privateKey, to, amount, metadata }),
		latest: async (pagination) => this.get("transactions/latest", pagination),
		getById: async (id) => this.get(`transactions/${id}`),
	};

	public names: FluxNames = {
		get: async (pagination) => this.get("names", pagination),
		cost: async () => this.get("names/cost"),
		latest: async (pagination) => this.get("names/latest", pagination),
		logs: async (pagination) => this.get("names/logs", pagination),
		logById: async (id) => this.get(`names/logs/${id}`),
		logsByName: async (name, pagination) => this.get(`names/${name}/logs`, pagination),
		getByName: async (name) => this.get(`names/${name}`),
		create: async (privateKey, name) => this.post(`names/${name}`, { privateKey }),
		transfer: async (privateKey, name, to) => this.post(`names/${name}/transfer`, { privateKey, to }),
		isAvailable: async (name) => this.get(`names/${name}/check`),
	}

	private getApiUrl(path: string): string {
		return `${this.API_URL}/api/${this.API_VERSION}/${path}`;
	}

	private async get(path: string, pagination?: PaginationProps) {
		try {
			const url = new URL(this.getApiUrl(path));
			if (pagination?.limit) url.searchParams.append("limit", pagination.limit.toString());
			if (pagination?.page) url.searchParams.append("page", pagination.page.toString());

			const response = await fetch(url.toString(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.json();
		} catch (error: any) {
			console.error(error);
			return { status: "error", message: error.message };
		}
	}

	private async post(path: string, data: any = {}, headers: any = {}) {
		try {
			const response = await fetch(this.getApiUrl(path), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				body: JSON.stringify(data),
			});
			return response.json();
		} catch (error: any) {
			console.error(error);
			return { status: "error", message: error.message };
		}
	}
}