import axios from "axios";
export { useFlux } from "./react";

type Wallet = {
	id: number;
	address: string;
	balance: number;
	totalIn: number;
	totalOut: number;
	privateKey: string;
	created: string;
};
type WalletCreate = Omit<Wallet, "balance" | "totalIn" | "totalOut" | "created">;

type TransactionType = "Deposit" | "Withdraw" | "Transfer";
type Transaction = {
	id: number;
	from: string;
	to: string;
	amount: number;
	type: TransactionType;
	time: string;
	metadata: { [key: string]: any };
}

type Name = {
	id: number;
	wallet: string;
	name: string;
	originalOwner: string;
	created: string;
}

type NameLog = {
	id: number;
	nameId: number;
	from: string;
	to: string;
	created: string;
}

type Stats = {
	totalTransactions: number;
	totalWallets: number;
	totalNames: number;
	totalCirculation: number;
}

type SuccessResponse<T> = { status: "success"; data: T };
export type ErrorResponse = { status: "error"; message: string };
export type PaginationResponse<T> = SuccessResponse<T> & { count: number; total: number; };
type PaginationProps = { limit?: number; page?: number; };

export interface FluxWallets {
	get: (pagination?: PaginationProps) => Promise<PaginationResponse<Omit<Wallet, "privateKey">[]>> | Promise<ErrorResponse>;
	create: () => Promise<SuccessResponse<WalletCreate>> | Promise<ErrorResponse>;
	rich: (pagination?: PaginationProps) => Promise<PaginationResponse<Omit<Wallet, "privateKey">[]>> | Promise<ErrorResponse>;
	getByAddress: (addresses: string | string[]) => 
  typeof addresses extends string ? Promise<SuccessResponse<Omit<Wallet, "privateKey">>> | Promise<ErrorResponse> : Promise<SuccessResponse<Omit<Wallet, "privateKey">[]>> | Promise<ErrorResponse>;
	getTransactions: (address: string, pagination?: PaginationProps) => Promise<PaginationResponse<Transaction[]>> | Promise<ErrorResponse>;
	getNames: (address: string) => Promise<SuccessResponse<Omit<Name, 'wallet'>[]>> | Promise<ErrorResponse>;
}

export interface FluxTransactions {
	get: (pagination?: PaginationProps) => Promise<PaginationResponse<Transaction[]>> | Promise<ErrorResponse>;
	create: (privateKey: string, to: string, amount: number, metadata?: { [key: string]: any }) => Promise<SuccessResponse<Transaction>> | Promise<ErrorResponse>;
	latest: (pagination?: PaginationProps) => Promise<PaginationResponse<Transaction[]>> | Promise<ErrorResponse>;
	getById: (id: number) => Promise<SuccessResponse<Transaction>> | Promise<ErrorResponse>;
}

export interface FluxNames {
	get: (pagination?: PaginationProps) => Promise<PaginationResponse<Name[]>> | Promise<ErrorResponse>;
	cost: () => Promise<SuccessResponse<{ cost: number }>> | Promise<ErrorResponse>;
	latest: (pagination?: PaginationProps) => Promise<PaginationResponse<Name[]>> | Promise<ErrorResponse>;
	logs: (pagination?: PaginationProps) => Promise<PaginationResponse<NameLog[]>> | Promise<ErrorResponse>;
	logById: (id: number) => Promise<SuccessResponse<NameLog>> | Promise<ErrorResponse>;
	logsByName: (name: string, pagination?: PaginationProps) => Promise<PaginationResponse<NameLog[]>> | Promise<ErrorResponse>;
	getByName: (name: string) => Promise<SuccessResponse<Name>> | Promise<ErrorResponse>;
	create: (privateKey: string, name: string) => Promise<SuccessResponse<Name>> | Promise<ErrorResponse>;
	transfer: (privateKey: string, name: string, to: string) => Promise<SuccessResponse<Name>> | Promise<ErrorResponse>;
	isAvailable: (name: string) => Promise<SuccessResponse<{ available: boolean }>> | Promise<ErrorResponse>;
}

export interface FluxStats {
	get: () => Promise<Stats>;
}

export interface FluxI {
	wallets: FluxWallets;
	transactions: FluxTransactions;
	names: FluxNames;
	stats: FluxStats;
}

export type FluxOptions = {
	apiUrl?: string;
	apiVersion?: string;
};

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
		getByAddress: async (addresses) => {
			console.log(addresses);
			if (Array.isArray(addresses)) {
				addresses = addresses.join(",");
				return this.get(`wallets`, undefined, { addresses });
			}
			return this.get(`wallets/${addresses}`);
			
		},
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

	public stats: FluxStats = {
		get: async () => this.get("stats").catch(() => ({ totalTransactions: 0, totalWallets: 0, totalNames: 0, totalCirculation: 0 }))
	};

	private getApiUrl(path: string): string {
		return `${this.API_URL}/api/${this.API_VERSION}/${path}`;
	}

	private async get(path: string, pagination?: PaginationProps, searchParams?: { [key: string]: any }) {
    try {
			const url = new URL(this.getApiUrl(path));
			if (pagination?.limit) url.searchParams.append("limit", pagination.limit.toString());
			if (pagination?.page) url.searchParams.append("page", pagination.page.toString());
			if (searchParams) {
				for (const key in searchParams) {
					url.searchParams.append(key, searchParams[key]);
				}
			}

			const response = await axios.get(url.toString(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.data;
    } catch (error: any) {
			console.error(error);
			return { status: "error", message: error.message };
    }
	}

private async post(path: string, data: any = {}, headers: any = {}) {
    try {
			const response = await axios.post(this.getApiUrl(path), data, {
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			});
			return response.data;
    } catch (error: any) {
			console.error(error);
			return { status: "error", message: error.message };
    }
}
}