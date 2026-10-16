import {
  Body, Controller, Get, Header, Headers, Param, ParseUUIDPipe, Post, Req, StreamableFile, UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard, CurrentUserId } from "../auth/auth.guard.js";
import { BillingService } from "./billing.service.js";
import { CreateCheckoutDto } from "./dto/create-checkout.dto.js";
import { VerifyPaymentDto } from "./dto/verify-payment.dto.js";

type RawRequest = Request & { rawBody?: Buffer };

@Controller("billing")
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  // The Pro price, for the public pricing page (no sign-in).
  @Get("pricing")
  @Header("Cache-Control", "public, max-age=60")
  pricing() {
    return this.billing.publicPricing();
  }

  @Get()
  @UseGuards(AuthGuard)
  summary(@CurrentUserId() userId: string) {
    return this.billing.summary(userId);
  }

  @Get("payments/:id/invoice")
  @UseGuards(AuthGuard)
  async invoice(@CurrentUserId() userId: string, @Param("id", new ParseUUIDPipe()) paymentId: string) {
    const { fileName, pdf } = await this.billing.invoice(userId, paymentId);
    return new StreamableFile(pdf, {
      type: "application/pdf",
      disposition: `attachment; filename="${fileName}"`,
      length: pdf.length,
    });
  }

  @Post("checkout")
  @UseGuards(AuthGuard)
  checkout(@CurrentUserId() userId: string, @Body() body: CreateCheckoutDto) {
    return this.billing.createCheckout(userId, body.cycle);
  }

  @Post("verify")
  @UseGuards(AuthGuard)
  verify(@CurrentUserId() userId: string, @Body() body: VerifyPaymentDto) {
    return this.billing.verifyPayment(userId, body);
  }

  @Post("webhook")
  webhook(
    @Req() request: RawRequest,
    @Headers("x-razorpay-signature") signature: string | undefined,
    @Body() body: unknown,
  ) {
    return this.billing.handleWebhook(request.rawBody, signature, body);
  }
}
