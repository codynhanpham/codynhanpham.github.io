<script lang="ts" module>
	import type { ButtonVariant } from '$lib/components/ui/button/index.js';

	// Type for the BarcodeInputButton component

	export type BarcodeInputButtonProps = {
		value: string;
		variant?: ButtonVariant;
		isFocused?: boolean;
		class?: string;
		[key: string]: any;
	};
</script>

<script lang="ts">
	// import { globalSearchBox } from "./search";
	import { cn } from '$lib/utils.js';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ScanBarcode from '@lucide/svelte/icons/scan-barcode';
	
	import { onMount } from 'svelte';

	import { Html5Qrcode } from 'html5-qrcode';
	import type { QrcodeSuccessCallback } from 'html5-qrcode';

	// let value: string = $state("");
	const urlexpression =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
	const urlregex = new RegExp(urlexpression);

	let cammeraPermissionGranted: boolean | null = $state(null);
	let cameraPermissionAlertDialogActive: boolean = $state(false);

	let qrcodeScanningDialogActive: boolean = $state(false);
	let html5QrCode: Html5Qrcode;
	let qrScanning: boolean = $state(false);

	function truncateString(str: string, length: number) {
		if (str.length > length) {
			return str.slice(0, length) + '...';
		} else {
			return str;
		}
	}

	function truncateURLString(str: string, length: number) {
		if (str.endsWith('/')) {
			str = str.slice(0, -1);
		}
		// if starts with http or www, remove it
		if (str.startsWith('http://')) {
			str = str.slice(7);
		}
		if (str.startsWith('https://')) {
			str = str.slice(8);
		}
		if (str.startsWith('www.')) {
			str = str.slice(4);
		}
		str = truncateString(str, length);

		return str;
	}

	// ---- BARCODE SCANNER FUNCTIONS ---- //
	async function checkCameraPermission(): Promise<boolean | null> {
		// If navigator.permissions is not supported, return true
		if (!navigator.permissions || !navigator.mediaDevices) {
			return false;
		}

		// Check if the user has granted permission to use the camera
		const permissionStatus = await navigator.permissions.query({
			name: 'camera' as PermissionName
		});
		if (permissionStatus.state === 'granted') {
			return true;
		} else if (permissionStatus.state === 'prompt') {
			return null;
		}
		return false;
	}

	async function requestCameraPermission(): Promise<boolean> {
		// If navigator.permissions is not supported, return for now
		if (!navigator.permissions || !navigator.mediaDevices) {
			return false;
		}

		cammeraPermissionGranted = await checkCameraPermission();
		if (cammeraPermissionGranted) {
			return true;
		}

		// Request permission to use the camera
		let stream: MediaStream | null = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true });
			cammeraPermissionGranted = true;
			// Do something with the stream, e.g., display it in a video element
		} catch (err) {
			console.error('Camera permission denied:', err);
			cammeraPermissionGranted = await checkCameraPermission();
			if (cammeraPermissionGranted === false) {
				toast('Camera Permission Denied', {
					description:
						'Camera permission prompt is blocked as you denied it last time. If you want to use barcode scanning, please enable it in your app (or browser) settings.',
					duration: 10_000,
					style:
						'display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.5rem; padding: 1rem;',
					class: '!bg-[#240f12] !border-rose-500/70',
					cancel: {
						label: 'Got it!',
						onClick: () => {}
					}
				});
			}
			return false;
		}
		if (stream) {
			// Stop the stream since we only need to get the permission
			stream.getTracks().forEach((track) => track.stop());
			return true;
		}

		return false;
	}

	async function handleBarcodeScanningStartup() {
		// If navigator.permissions is not supported, return for now
		if (!navigator.permissions) {
			return;
		}

		// Check if the user has granted permission to use the camera
		if (!cammeraPermissionGranted) {
			cameraPermissionAlertDialogActive = true; // Show the alert dialog to request permission
			return;
		}

		// If the user has granted permission, start the scanning process
		qrcodeScanningDialogActive = true;
		await new Promise((resolve) => setTimeout(resolve, 200));
		await handleBarcodeScanning();
	}

	async function handleBarcodeScanning() {
		// This will only be triggered when the qrcodeScanningDialogActive is true.
		// The camera permission is already checked in handleBarcodeScanningStartup.
		const qrContainer = document.getElementById('qrcode-scanner-container');
		const qrContainerWidth = qrContainer?.clientWidth || 250;

		html5QrCode = new Html5Qrcode('qrcode-scanner-container');
		const config = {
			fps: 10,
			qrbox: {
				width: Math.round(qrContainerWidth * 0.7),
				height: Math.round(qrContainerWidth * 0.32)
			}
		};
		await html5QrCode.start(
			{ facingMode: 'environment' },
			config,
			qrCodeSuccessCallback,
			undefined
		);
		qrScanning = true;
	}

	const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText, result) => {
		value = decodedText;
		isFocused = true;
		html5QrCode
			.stop()
			.then((ignore) => {
				// QR Code scanning is stopped.
			})
			.catch((err) => {
				// Stop failed, handle it.
			});
		qrcodeScanningDialogActive = false;
	};

	async function stopQrCodeScanning() {
		html5QrCode
			.stop()
			.then((ignore) => {
				// QR Code scanning is stopped.
			})
			.catch((err) => {
				console.error('Stopping QR Code scanning failed:', err);
			});

		// Just to make sure, close the dialog.
		qrcodeScanningDialogActive = false;
	}

	// ---- ON MOUNT FUNCTIONS ---- //
	onMount(() => {
		(async () => {
			cammeraPermissionGranted = await checkCameraPermission();
		})();
	});

	let {
		value = $bindable(''),
		variant = 'default',
		isFocused = $bindable(false),
		class: className,

		...restProps
	}: BarcodeInputButtonProps = $props();
</script>

<!-- class="text-muted-foreground absolute right-0 top-0 w-[2.8rem] h-[2.815rem] rounded-none hover:text-foreground border-l {inputFocused ? 'rounded-tr-xl' : 'rounded-r-xl'}" -->
<Button
	{variant}
	class={cn(className)}
	size="icon"
	aria-label="Scan Barcode"
	onclick={() => handleBarcodeScanningStartup()}
	title="Scan Barcode"
>
	<ScanBarcode class="size-5 flex-grow" />
</Button>

<AlertDialog.Root bind:open={cameraPermissionAlertDialogActive}>
	<AlertDialog.Content class="mx-auto max-w-[97vw] rounded-lg md:max-w-[50ch] lg:max-w-prose">
		<AlertDialog.Header>
			<AlertDialog.Title>Allow Camera Permission</AlertDialog.Title>
			<AlertDialog.Description>
				Barcode scanning requires camera access. Please allow access to your camera in the next
				screen.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={() => (cameraPermissionAlertDialogActive = false)}
				>Cancel</AlertDialog.Cancel
			>
			<AlertDialog.Action
				onclick={async () => {
					if (!cammeraPermissionGranted) {
						cameraPermissionAlertDialogActive = false;
						const permission = await requestCameraPermission();
						if (permission) {
							cameraPermissionAlertDialogActive = false;
							handleBarcodeScanningStartup();
						}
					}
				}}
			>
				Continue
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root
	bind:open={qrcodeScanningDialogActive}
	onOpenChange={(open) => {
		qrcodeScanningDialogActive = open;
		if (!open) {
			qrScanning = false;
			stopQrCodeScanning();
		}
	}}
>
	<Dialog.Content class="mx-auto max-w-[97vw] rounded-lg md:max-w-[50ch] lg:max-w-prose">
		<Dialog.Header>
			<Dialog.Title>Barcode Scanning</Dialog.Title>
			<Dialog.Description>
				<p class="mb-4 text-sm text-muted-foreground">
					Align the barcode or QR code within the frame
				</p>
				<div
					id="qrcode-scanner-container"
					class="flex h-full max-h-fit min-h-[12rem] w-full items-start justify-center overflow-clip rounded-lg {!qrScanning
						? 'animate-pulse bg-muted/20'
						: ''}"
				>
					{#if !qrScanning}
						<LoaderCircle class="size-8 animate-spin self-center text-foreground" />
					{/if}
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
	<Dialog.Close class="sr-only">Close Dialog</Dialog.Close>
</Dialog.Root>
