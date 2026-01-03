import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toLogical(value: unknown, defaultValue: boolean = false): boolean {
	if (typeof value === "string") {
		const val = value.toLowerCase().trim();
		if (val === "false" || val=== "f" || val === "0" || val === "no" || val === "n" || val === "off" || val === "") {
			return false;
		}
		if (val === "true" || val === "t" || val === "1" || val === "yes" || val === "y" || val === "on") {
			return true;
		}
		return defaultValue;
	} else if (typeof value === "number") {
		return value !== 0;
	} else if (typeof value === "boolean") {
		return value;
	}
	return defaultValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
