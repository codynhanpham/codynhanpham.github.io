import type { WithChildren } from 'bits-ui';
import type { Snippet } from 'svelte';
import type { TerminalSession } from './terminal.svelte.js';

export type TerminalRootProps = WithChildren<{
	class?: string;
	delay?: number;
	speed?: number;
	onComplete?: () => void;
	onAnimationStep?: () => void;
	session?: TerminalSession;
}>;

export type TerminalLoopProps = WithChildren<{
	delay?: number;
}>;

export type TerminalAnimationProps = WithChildren<{
	delay?: number;
	class?: string;
}>;

export type TerminalLoadingProps = Omit<TerminalAnimationProps, 'children'> & {
	loadingMessage: Snippet<[]>;
	completeMessage: Snippet<[]>;
	duration?: number;
};
