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

type Status = "success" | "error";
type SuccessResponse<T> = { status: "success"; data: T };
type ErrorResponse = { status: "error"; message: string };
export type PaginationResponse<T> = SuccessResponse<T> & { count: number; total: number; };
type PaginationProps = { limit?: number; page?: number; };

export interface FluxWallets {
	get: (pagination?: PaginationProps) => Promise<PaginationResponse<Omit<Wallet, "privateKey">[]>> | Promise<ErrorResponse>;
	create: () => Promise<SuccessResponse<WalletCreate>> | Promise<ErrorResponse>;
	rich: (pagination?: PaginationProps) => Promise<PaginationResponse<Omit<Wallet, "privateKey">[]>> | Promise<ErrorResponse>;
	getByAddress: (address: string) => Promise<SuccessResponse<Omit<Wallet, "privateKey">>> | Promise<ErrorResponse>;
	getTransactions: (address: string, pagination?: PaginationProps) => Promise<PaginationResponse<Transaction[]>> | Promise<ErrorResponse>;
	getNames: (address: string) => Promise<SuccessResponse<Omit<Name, 'wallet'>[]>> | Promise<ErrorResponse>;
}

export interface FluxTransactions {
	get: (pagination?: PaginationProps) => Promise<PaginationResponse<Transaction[]>> | Promise<ErrorResponse>;
	create: (privateKey: string, to: string, amount: number, metadata: { [key: string]: any }) => Promise<SuccessResponse<Transaction>> | Promise<ErrorResponse>;
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

export interface FluxI {
	wallets: FluxWallets;
	transactions: FluxTransactions;
	names: FluxNames;
}

export type FluxOptions = {
	apiUrl?: string;
	apiVersion?: string;
};