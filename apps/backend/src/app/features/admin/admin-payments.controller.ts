import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import type { AdminPaymentList } from "@nakka/types/admin";
import { AdminPaymentsRepository } from "./admin-payments.repository.js";
import { AdminGuard } from "./admin.guard.js";
import { ListPaymentsDto } from "./dto/list-payments.dto.js";

@Controller("admin/payments")
@UseGuards(AdminGuard)
export class AdminPaymentsController {
  constructor(private readonly payments: AdminPaymentsRepository) {}

  @Get()
  async list(@Query() query: ListPaymentsDto): Promise<AdminPaymentList> {
    const [{ items, total }, totals] = await Promise.all([
      this.payments.list(query.search, query.status, query.page, query.pageSize),
      this.payments.totals(),
    ]);
    return { items, total, page: query.page, pageSize: query.pageSize, totals };
  }
}
