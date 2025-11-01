import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProps } from "@/types/payment";
import crypto from "crypto";

export const POST = async (request: Request) => {
	try {
		const data: PaymentProps = await request.json();

		console.log("=== MIDTRANS NOTIFICATION ===");
		console.log("Payload:", JSON.stringify(data, null, 2));

		const reservationId = data.order_id;
		const transactionStatus = data.transaction_status;
		const paymentType = data.payment_type || "unknown";
		const fraudStatus = data.fraud_status;
		const statusCode = data.status_code;
		const grossAmount = data.gross_amount;
		const signatureKey = data.signature_key;

		// Verify signature
		const serverKey = process.env.MIDTRANS_SERVER_KEY;

		if (!serverKey) {
			console.error("MIDTRANS_SERVER_KEY not found in environment");
			return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
		}

		const hash = crypto
			.createHash("sha512")
			.update(`${reservationId}${statusCode}${grossAmount}${serverKey}`)
			.digest("hex");

		console.log("Signature check:", {
			received: signatureKey,
			calculated: hash,
			match: signatureKey === hash
		});

		if (signatureKey !== hash) {
			console.error("Invalid signature for order:", reservationId);
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		// Check if payment exists
		const existingPayment = await prisma.payment.findUnique({
			where: { id: reservationId }
		});

		if (!existingPayment) {
			console.error("Payment not found:", reservationId);
			return NextResponse.json({
				error: "Payment not found",
				order_id: reservationId
			}, { status: 404 });
		}

		console.log("Current payment status:", existingPayment.status);

		// Determine payment status
		let paymentStatus: "PAID" | "FAILED" | "PENDING" | null = null;

		if (transactionStatus === "capture") {
			paymentStatus = fraudStatus === "accept" ? "PAID" : null;
		} else if (transactionStatus === "settlement") {
			paymentStatus = "PAID";
		} else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
			paymentStatus = "FAILED";
		} else if (transactionStatus === "pending") {
			paymentStatus = "PENDING";
		}

		console.log("New payment status:", paymentStatus);

		// Update payment
		if (paymentStatus) {
			const updatedPayment = await prisma.payment.update({
				data: {
					method: paymentType,
					status: paymentStatus,
				},
				where: {
					id: reservationId,
				},
			});

			console.log("✅ Payment updated successfully");

			// Midtrans expects 200 OK response
			return NextResponse.json({
				status: "success",
				data: {
					order_id: reservationId,
					payment_status: paymentStatus
				}
			}, { status: 200 });
		}

		// For unhandled statuses, still return 200 to prevent retries
		console.warn("Unhandled transaction status:", transactionStatus);
		return NextResponse.json({
			status: "acknowledged",
			transaction_status: transactionStatus
		}, { status: 200 });

	} catch (error) {
		// Log the full error for debugging
		console.error("=== WEBHOOK ERROR ===");
		console.error("Error:", error);
		console.error("Stack:", error instanceof Error ? error.stack : "No stack trace");

		// Still return 200 to prevent Midtrans from retrying
		// (since the error might be a temporary DB issue)
		return NextResponse.json({
			status: "error",
			message: error instanceof Error ? error.message : "Unknown error"
		}, { status: 200 });
	}
};