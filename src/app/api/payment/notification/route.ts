import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProps } from "@/types/payment";
import crypto from "crypto";

export const POST = async (request: Request) => {
	const data: PaymentProps = await request.json();
	const reservationId = data.order_id;

	let responseData = null;

	const transaction_status = data.transaction_status;
	const payment_type = data.payment_type || null;
	const fraud_status = data.fraud_status;
	const status_code = data.status_code;
	const gross_amount = data.gross_amount;
	const signature_key = data.signature_key;

	const hash = crypto.createHash("sha512").update(`${reservationId}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest("hex");
	if (hash !== signature_key) {
		return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
	}

	if (transaction_status == "capture") {
		if (fraud_status == "accept") {
			const transaction = await prisma.payment.update({
				data: {
					method: payment_type,
					status: "PAID"
				},
				where: {
					reservationId
				}
			})
			responseData = transaction
		}
	} else if (transaction_status == "settlement") {
		const transaction = await prisma.payment.update({
			data: {
				method: payment_type,
				status: "PAID"
			},
			where: {
				reservationId
			}
		})
		responseData = transaction
	} else if (transaction_status == "cancel" || transaction_status == "deny" || transaction_status == "expired") {
		const transaction = await prisma.payment.update({
			data: {
				method: payment_type,
				status: "FAILED"
			},
			where: {
				reservationId
			}
		})
		responseData = transaction
	} else if (transaction_status == "pending") {
		const transaction = await prisma.payment.update({
			data: {
				method: payment_type,
				status: "PENDING"
			},
			where: {
				reservationId
			}
		})
		responseData = transaction
	}

	return NextResponse.json({ responseData }, { status: 200 })
}